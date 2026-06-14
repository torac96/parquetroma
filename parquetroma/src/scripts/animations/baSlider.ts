export function initBASliders(): void {
  document.querySelectorAll<HTMLElement>('[data-slider]').forEach(slider => {
    const before = slider.querySelector<HTMLElement>('.ba-before');
    const handle = slider.querySelector<HTMLElement>('.ba-handle');
    if (!before || !handle) return;

    let dragging = false;
    let startX = 0;
    let startPct = 50;
    let currentPct = 50;

    function setPosition(pct: number): void {
      const clamped = Math.min(Math.max(pct, 2), 98);
      currentPct = clamped;
      before.style.width = `${clamped}%`;
      handle.style.left  = `${clamped}%`;
    }

    function getPct(clientX: number): number {
      const r = slider.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    }

    slider.addEventListener('mousedown', (e: MouseEvent) => {
      dragging = true;
      startX = e.clientX;
      startPct = currentPct;
      slider.style.cursor = 'col-resize';
    });

    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!dragging) return;
      setPosition(getPct(e.clientX));
    });

    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      slider.style.cursor = '';
    });

    /* Touch */
    slider.addEventListener('touchstart', (e: TouchEvent) => {
      dragging = true;
      startX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener('touchmove', (e: TouchEvent) => {
      if (!dragging) return;
      setPosition(getPct(e.touches[0].clientX));
    }, { passive: true });

    window.addEventListener('touchend', () => { dragging = false; });

    /* Keyboard */
    slider.setAttribute('tabindex', '0');
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-valuenow', '50');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');

    slider.addEventListener('keydown', (e: KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 2;
      if (e.key === 'ArrowLeft')  { setPosition(currentPct - step); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPosition(currentPct + step); e.preventDefault(); }
      slider.setAttribute('aria-valuenow', String(Math.round(currentPct)));
    });
  });
}
