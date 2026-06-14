export function initFaqAccordion(): void {
  document.querySelectorAll<HTMLElement>('.faq-item').forEach(item => {
    const trigger = item.querySelector<HTMLElement>('.faq-item__question');
    const answer  = item.querySelector<HTMLElement>('.faq-item__answer');
    const icon    = item.querySelector<HTMLElement>('.faq-item__icon');
    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      /* Close all others */
      document.querySelectorAll<HTMLElement>('.faq-item.open').forEach(other => {
        if (other !== item) {
          const a = other.querySelector<HTMLElement>('.faq-item__answer');
          const ic = other.querySelector<HTMLElement>('.faq-item__icon');
          other.classList.remove('open');
          if (a) a.style.maxHeight = '0';
          if (ic) ic.style.transform = '';
          other.querySelector<HTMLElement>('.faq-item__question')?.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      if (icon) icon.style.transform = isOpen ? '' : 'rotate(45deg)';
      answer.style.maxHeight = isOpen ? '0' : `${answer.scrollHeight}px`;
    });
  });
}
