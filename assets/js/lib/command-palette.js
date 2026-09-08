// A minimal ⌘K command palette.
// Exposes pure `fuzzyScore` for unit-testability.

export function fuzzyScore(query, label) {
  const q = query.toLowerCase().trim();
  const s = label.toLowerCase();
  if (q === '') return 0; // 0 = neutral; empty query keeps original order
  if (s.includes(q)) return 100 - s.indexOf(q) - s.length * 0.01; // contiguous hit; earlier is stronger, shorter label breaks ties
  // Subsequence match: every char of q appears in s in order
  let i = 0;
  for (const ch of s) {
    if (ch === q[i]) i++;
    if (i === q.length) return 40 - (s.length - q.length);
  }
  return -1;
}

export function rank(actions, query) {
  return actions
    .map((a) => ({ a, score: fuzzyScore(query, a.label) }))
    .filter((x) => x.score >= 0)
    .sort((x, y) => y.score - x.score)
    .map((x) => x.a);
}

export function mountCommandPalette(actions) {
  const root = document.querySelector('#cmdkRoot');
  const input = document.querySelector('#cmdkInput');
  const list = document.querySelector('#cmdkList');
  const trigger = document.querySelector('#cmdkBtn');
  if (!root || !input || !list) return;

  let openState = false;
  let activeIndex = 0;
  let visible = actions;

  const renderList = () => {
    list.innerHTML = visible
      .map(
        (a, i) => `
        <li>
          <button data-cmd-idx="${i}"
                  class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                    i === activeIndex ? 'bg-surface-2 text-text-hi' : 'text-text-mid hover:bg-surface-2'
                  }">
            <span class="flex items-center gap-3"><i class="${a.icon} text-accent-2 w-4"></i>${a.label}</span>
            <span class="font-mono text-xs text-text-lo">${a.hint ?? ''}</span>
          </button>
        </li>`,
      )
      .join('');
  };

  const open = () => {
    openState = true;
    root.classList.remove('hidden');
    root.classList.add('flex');
    input.value = '';
    activeIndex = 0;
    visible = actions;
    renderList();
    setTimeout(() => input.focus(), 30);
  };
  const close = () => {
    openState = false;
    root.classList.add('hidden');
    root.classList.remove('flex');
  };
  const runActive = () => {
    const action = visible[activeIndex];
    if (!action) return;
    close();
    action.run();
  };

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openState ? close() : open();
      return;
    }
    if (!openState) return;
    if (e.key === 'Escape') return close();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(visible.length - 1, activeIndex + 1);
      renderList();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(0, activeIndex - 1);
      renderList();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      runActive();
    }
  });

  input.addEventListener('input', () => {
    visible = rank(actions, input.value);
    activeIndex = 0;
    renderList();
  });

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cmd-idx]');
    if (!btn) return;
    activeIndex = Number(btn.dataset.cmdIdx);
    runActive();
  });

  trigger?.addEventListener('click', open);
  root.addEventListener('click', (e) => {
    if (e.target === root) close();
  });
}
