let headerController: AbortController | null = null;

export function initHeader(): void {
  // Abort previous listeners to prevent accumulation across View Transitions
  headerController?.abort();
  headerController = new AbortController();
  const { signal } = headerController;

  const header = document.querySelector<HTMLElement>('.header');
  const burger = document.querySelector<HTMLElement>('.header__burger');
  const nav    = document.querySelector<HTMLElement>('.header__nav');
  if (!header) return;

  /* Scroll state */
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true, signal });

  /* Mobile menu */
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }, { signal });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }, { signal });
    });

    document.addEventListener('click', (e: MouseEvent) => {
      if (!header.contains(e.target as Node) && nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }, { signal });
  }
}
