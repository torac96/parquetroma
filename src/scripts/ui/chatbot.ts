interface Message {
  role: 'user' | 'model';
  text: string;
}

const history: Message[] = [];

function getApiBase(): string {
  const base = document.documentElement.dataset.base ?? '';
  return `${base}/api/chat`;
}

// Returns the production site origin (e.g. "https://www.parquetroma.it")
// stored at build time on the panel element so links stay relative on any env.
function getSiteUrl(): string {
  return document.getElementById('chatbot-panel')?.dataset.siteurl ?? '';
}

// If href is an absolute URL pointing to our own domain, strip origin → relative path
function toRelativeIfInternal(href: string): string {
  const siteUrl = getSiteUrl();
  if (siteUrl && href.startsWith(siteUrl + '/')) return href.slice(siteUrl.length);
  // Also handle current origin (works in dev/preview automatically)
  if (href.startsWith(window.location.origin + '/')) return href.slice(window.location.origin.length);
  return href;
}

// Minimal safe markdown → HTML
// Split order: markdown links → phone numbers → emails → plain text
function renderMarkdown(text: string): string {
  const SPLIT_RE = /(\[[^\]]+\]\((?:(?:https?|tel|mailto):\/?\/?|\/)[^)]+\)|\+39[\s\-.]?\d[\d\s\-.]{5,12}\d|[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g;
  const parts = text.split(SPLIT_RE);

  return parts.map((part, i) => {
    if (i % 2 === 1) {
      // Markdown link: [label](href) — absolute or relative
      const mdLink = part.match(/^\[([^\]]+)\]\(((?:(?:https?|tel|mailto):\/?\/?|\/)[^)]+)\)$/);
      if (mdLink) {
        const [, label, rawHref] = mdLink;
        const href = toRelativeIfInternal(rawHref);
        const isExternal = href.startsWith('http');
        return `<a href="${href}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
      }
      // Bare phone number (e.g. +39-06-1234-5678)
      if (part.startsWith('+39')) {
        const digits = part.replace(/[^\d]/g, '');
        return `<a href="tel:+${digits}">${part}</a>`;
      }
      // Bare email address
      if (part.includes('@')) {
        return `<a href="mailto:${part}">${part}</a>`;
      }
    }
    return part
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^[•\-\*] (.+)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br>');
  })
  .join('')
  .replace(/(<li>.*?<\/li>)/gs, (m) => `<ul>${m}</ul>`);
}

function createMessageEl(role: 'user' | 'model'): HTMLElement {
  const div = document.createElement('div');
  div.className = `chatbot__msg chatbot__msg--${role}`;
  return div;
}

function setContent(el: HTMLElement, text: string, streaming = false) {
  el.innerHTML = renderMarkdown(text);
  el.classList.toggle('chatbot__msg--streaming', streaming);
}

function scrollToBottom(el: HTMLElement) {
  el.scrollTop = el.scrollHeight;
}

function setStatusText(text: string) {
  const el = document.getElementById('chatbot-status-text');
  if (el) el.textContent = text;
}

export function initChatbot() {
  const toggle      = document.getElementById('chatbot-toggle') as HTMLButtonElement | null;
  const panel       = document.getElementById('chatbot-panel') as HTMLElement | null;
  const closeBtn    = document.getElementById('chatbot-close') as HTMLButtonElement | null;
  const messages    = document.getElementById('chatbot-messages') as HTMLElement | null;
  const input       = document.getElementById('chatbot-input') as HTMLInputElement | null;
  const send        = document.getElementById('chatbot-send') as HTMLButtonElement | null;
  const quickreplies = document.getElementById('chatbot-quickreplies') as HTMLElement | null;

  if (!toggle || !panel || !closeBtn || !messages || !input || !send) return;

  let isOpen = false;
  let isLoading = false;
  let greeted = false;
  let userHasSent = false;

  function open() {
    isOpen = true;
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('chatbot__panel--open');
    toggle.setAttribute('aria-expanded', 'true');
    setTimeout(() => input!.focus(), 50);

    if (!greeted) {
      greeted = true;
      // Show greeting with slight delay for polish
      setTimeout(() => {
        const greeting = createMessageEl('model');
        setContent(greeting, 'Ciao! 👋 Sono l\'assistente di **ParquetRoma**.\nCome posso aiutarti oggi? Puoi chiedermi informazioni su servizi, preventivi, zone coperte o tempi di lavoro.');
        messages!.appendChild(greeting);
        scrollToBottom(messages!);
      }, 180);
    }
  }

  function closePanel() {
    isOpen = false;
    panel.setAttribute('aria-hidden', 'true');
    panel.classList.remove('chatbot__panel--open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => (isOpen ? closePanel() : open()));
  closeBtn.addEventListener('click', closePanel);
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });

  // Quick reply chips
  quickreplies?.querySelectorAll<HTMLButtonElement>('.chatbot__chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const msg = chip.dataset.msg;
      if (msg) {
        input!.value = msg;
        doSend();
      }
    });
  });

  // Hide quick replies after first user message
  function hideQuickReplies() {
    if (!userHasSent && quickreplies) {
      userHasSent = true;
      quickreplies.classList.add('hidden');
    }
  }

  function setLoading(loading: boolean) {
    isLoading = loading;
    send!.disabled = loading;
    input!.disabled = loading;
    send!.classList.toggle('chatbot__send--loading', loading);
    setStatusText(loading ? 'sta scrivendo…' : 'Online · risponde subito');
  }

  async function doSend() {
    const text = input!.value.trim();
    if (!text || isLoading) return;

    input!.value = '';
    hideQuickReplies();
    setLoading(true);

    // User message
    const userEl = createMessageEl('user');
    userEl.textContent = text;
    messages!.appendChild(userEl);
    scrollToBottom(messages!);

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'chatbot__msg--typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messages!.appendChild(typing);
    scrollToBottom(messages!);

    const replyEl = createMessageEl('model');
    let fullText = '';
    let replyAdded = false;

    try {
      const res = await fetch(getApiBase(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.body) throw new Error('no body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6);

          if (payload === '[DONE]') {
            setContent(replyEl, fullText, false); // remove cursor
            break;
          }

          if (payload.startsWith('[ERROR]')) {
            typing.remove();
            replyEl.textContent = payload.slice(8);
            if (!replyAdded) { messages!.appendChild(replyEl); replyAdded = true; }
            scrollToBottom(messages!);
            break;
          }

          const chunk = payload.replace(/\\n/g, '\n');
          fullText += chunk;

          if (!replyAdded) {
            typing.remove();
            messages!.appendChild(replyEl);
            replyAdded = true;
          }
          setContent(replyEl, fullText, true); // streaming cursor active
          scrollToBottom(messages!);
        }
      }

      if (fullText) {
        setContent(replyEl, fullText, false); // ensure cursor removed
        history.push({ role: 'user', text });
        history.push({ role: 'model', text: fullText });
      }
    } catch {
      typing.remove();
      replyEl.textContent = 'Errore di connessione. Riprova o chiamaci direttamente.';
      if (!replyAdded) { messages!.appendChild(replyEl); replyAdded = true; }
      scrollToBottom(messages!);
    } finally {
      if (typing.parentElement) typing.remove();
      setLoading(false);
      input!.focus();
    }
  }

  send.addEventListener('click', doSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
  });
}
