// Renders a 2px gradient bar at the top of the viewport whose width tracks scroll.
// Exported `computeProgress` is pure so it can be unit-tested.

export function computeProgress(scrollY, scrollHeight, viewportHeight) {
  const denom = Math.max(scrollHeight - viewportHeight, 1);
  const ratio = scrollY / denom;
  if (Number.isNaN(ratio)) return 0;
  return Math.max(0, Math.min(1, ratio));
}

export function mountScrollProgress(targetSelector = '#scroll-progress') {
  const bar = document.querySelector(targetSelector);
  if (!bar) return;

  const update = () => {
    const p = computeProgress(
      window.scrollY,
      document.documentElement.scrollHeight,
      window.innerHeight,
    );
    bar.style.transform = `scaleX(${p})`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}
