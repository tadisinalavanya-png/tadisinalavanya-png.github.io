// Wires up any element with [data-action="copy-email"] to copy the configured
// email to clipboard and show a toast.

export function mountCopyEmail(email, toastRootSelector = '#toastRoot') {
  document.addEventListener('click', async (event) => {
    const trigger = event.target.closest('[data-action="copy-email"]');
    if (!trigger) return;
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied to clipboard', toastRootSelector);
    } catch {
      showToast('Copy failed — your email is ' + email, toastRootSelector);
    }
  });
}

function showToast(message, rootSel) {
  const root = document.querySelector(rootSel);
  if (!root) return;
  const el = document.createElement('div');
  el.className =
    'rounded-full hairline bg-surface px-4 py-2 text-sm text-text-hi shadow-2xl opacity-0 transition';
  el.style.backgroundColor = 'rgba(14,14,20,0.95)';
  el.textContent = message;
  root.appendChild(el);
  requestAnimationFrame(() => (el.style.opacity = '1'));
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 220);
  }, 2200);
}
