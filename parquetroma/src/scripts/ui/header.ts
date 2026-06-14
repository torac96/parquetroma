export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('.header');
  const burger = document.querySelector<HTMLElement>('.header__burger');
  const nav    = document.querySelector<HTMLElement>('.header__nav');
  if (!header) return;

  /* Scroll state */
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    lastY = y;
  }, { passive: true });

  /* Mobile menu */
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close on nav link click */
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* Close on outside click */
    document.addEventListener('click', (e: MouseEvent) => {
      if (!header.contains(e.target as Node) && nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
}
