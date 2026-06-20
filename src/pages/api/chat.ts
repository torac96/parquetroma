export const prerender = false;

import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from '../../data/chatbot-context';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const MAX_HISTORY = 10;
const MAX_MESSAGE_LENGTH = 500;

function getApiKeys(): string[] {
  const env = import.meta.env;
  const keys = [
    env.GEMINI_API_KEY_1,
    env.GEMINI_API_KEY_2,
    env.GEMINI_API_KEY_3,
    env.GEMINI_API_KEY,
  ].filter((k): k is string => typeof k === 'string' && k.length > 10);
  return [...new Set(keys)];
}

function pickKey(keys: string[], exclude: Set<string>): string | null {
  const available = keys.filter(k => !exclude.has(k));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

function isRateLimitError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return msg.includes('429') || msg.includes('quota') || msg.includes('rate');
  }
  return false;
}

function sseChunk(text: string): Uint8Array {
  // Escape newlines inside the data value, then close with \n\n
  const escaped = text.replace(/\n/g, '\\n');
  return new TextEncoder().encode(`data: ${escaped}\n\n`);
}

function sseDone(): Uint8Array {
  return new TextEncoder().encode('data: [DONE]\n\n');
}

function sseError(msg: string): Uint8Array {
  return new TextEncoder().encode(`data: [ERROR] ${msg}\n\n`);
}

export const POST: APIRoute = async ({ request }) => {
  const keys = getApiKeys();
  if (keys.length === 0) {
    return new Response(sseError('Servizio non disponibile.'), {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  }

  let body: { message?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(sseError('Richiesta non valida.'), {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    });
  }

  const message = typeof body.message === 'string' ? body.message.trim().slice(0, MAX_MESSAGE_LENGTH) : '';
  if (!message) {
    return new Response(sseError('Messaggio vuoto.'), {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    });
  }

  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const history: Message[] = rawHistory
    .filter((m): m is Message => m && typeof m === 'object' && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string')
    .slice(-MAX_HISTORY);

  const triedKeys = new Set<string>();

  // Try keys until one works
  let lastErr: unknown;
  while (true) {
    const key = pickKey(keys, triedKeys);
    if (!key) break;
    triedKeys.add(key);

    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({
        model: 'gemini-flash-lite-latest',
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: { maxOutputTokens: 200 },
      });

      const chat = model.startChat({
        history: history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }],
        })),
      });

      const streamResult = await chat.sendMessageStream(message);

      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamResult.stream) {
              const text = chunk.text();
              if (text) controller.enqueue(sseChunk(text));
            }
            controller.enqueue(sseDone());
          } catch (e) {
            controller.enqueue(sseError('Errore durante la risposta.'));
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
          'Connection': 'keep-alive',
        },
      });
    } catch (err) {
      lastErr = err;
      if (isRateLimitError(err) && triedKeys.size < keys.length) continue;
      console.error('[chatbot]', err);
      break;
    }
  }

  return new Response(sseError('Errore temporaneo. Riprova o contattaci direttamente.'), {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
};
