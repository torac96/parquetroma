const STORAGE_KEY = 'parquetroma-theme';

export function initTheme(): void {
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved === 'dark' || (!saved && prefersDark);
  document.documentElement.classList.toggle('dark', isDark);
}

export function toggleTheme(): void {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');

  // Dispatch event for other components to react
  document.dispatchEvent(new CustomEvent('theme:change', { detail: { dark: isDark } }));
}

export function isDarkMode(): boolean {
  return document.documentElement.classList.contains('dark');
}
