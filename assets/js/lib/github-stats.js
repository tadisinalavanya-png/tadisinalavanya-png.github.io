// Fetches GitHub repo metadata (stars, updated_at) and writes into card slots
// with data-repo-slug. Caches per-slug in sessionStorage for 1 hour.

const TTL_MS = 60 * 60 * 1000;
const STORAGE_PREFIX = 'gh-stats:';

export function formatRelativeTime(nowMs, thenIso) {
  const then = new Date(thenIso).getTime();
  if (Number.isNaN(then)) return '—';
  const diff = Math.max(0, nowMs - then);
  const day = 24 * 60 * 60 * 1000;
  if (diff < day) return 'today';
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  if (diff < 60 * day) return `${Math.floor(diff / (7 * day))}w ago`;
  if (diff < 365 * day) return `${Math.floor(diff / (30 * day))}mo ago`;
  return `${Math.floor(diff / (365 * day))}y ago`;
}

function readCache(slug) {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + slug);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(slug, data) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + slug, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {}
}

async function fetchOne(slug) {
  const cached = readCache(slug);
  if (cached) return cached;

  const res = await fetch(`https://api.github.com/repos/${slug}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${slug}`);
  const data = await res.json();
  const trimmed = {
    stars: data.stargazers_count ?? 0,
    updated_at: data.pushed_at ?? data.updated_at,
  };
  writeCache(slug, trimmed);
  return trimmed;
}

export async function hydrateGitHubStats(rootSelector = '#featuredGrid') {
  const root = document.querySelector(rootSelector);
  if (!root) return;
  const cards = root.querySelectorAll('[data-repo-slug]');
  const now = Date.now();

  await Promise.allSettled(
    Array.from(cards).map(async (card) => {
      const slug = card.getAttribute('data-repo-slug');
      if (!slug) return;
      try {
        const { stars, updated_at } = await fetchOne(slug);
        const starEl = card.querySelector('[data-stats="stars"]');
        const upEl = card.querySelector('[data-stats="updated"]');
        if (starEl) starEl.textContent = `★ ${stars}`;
        if (upEl) upEl.textContent = `updated ${formatRelativeTime(now, updated_at)}`;
      } catch (e) {
        // Leave dashes; graceful fallback.
        console.warn('github-stats:', e);
      }
    }),
  );
}
