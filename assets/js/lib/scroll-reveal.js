// Adds `.in-view` to elements with `.reveal` when they enter the viewport.
// One-shot: observer disconnects per element after first reveal.

export function mountScrollReveal(selector = '.reveal') {
  const els = document.querySelectorAll(selector);
  if (els.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  els.forEach((el) => io.observe(el));
}
