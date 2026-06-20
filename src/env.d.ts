/// <reference types="astro/client" />

interface ImportMetaEnv {
  // Multi-key rotation (consigliato — usa fino a 3 chiavi Gemini gratuite)
  readonly GEMINI_API_KEY_1?: string;
  readonly GEMINI_API_KEY_2?: string;
  readonly GEMINI_API_KEY_3?: string;
  // Singola chiave (fallback, compatibilità)
  readonly GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
