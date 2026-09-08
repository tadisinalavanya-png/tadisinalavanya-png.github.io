// Renders two infinite-scroll rows of brand chips inside #stackMarquee.
// Duplicates content so the keyframe animation wraps seamlessly at translateX(-50%).

const FALLBACK_ICON_BY_NAME = {
  Java: 'fab fa-java',
  Python: 'fab fa-python',
  Docker: 'fab fa-docker',
  AWS: 'fab fa-aws',
  Node: 'fab fa-node-js',
  TypeScript: 'fab fa-js',
  Git: 'fab fa-git-alt',
  GitHub: 'fab fa-github',
  React: 'fab fa-react',
};

function chip({ name, logo }) {
  const visual = logo
    ? `<img src="${logo}" alt="" class="h-5 w-5 opacity-90" />`
    : `<i class="${FALLBACK_ICON_BY_NAME[name] ?? 'fas fa-code'} text-accent-2"></i>`;
  return `
    <div class="flex shrink-0 items-center gap-2 rounded-full hairline bg-surface/60 px-4 py-2 text-sm text-text-mid backdrop-blur">
      ${visual}<span>${name}</span>
    </div>
  `;
}

export function mountMarquee(stack) {
  const root = document.querySelector('#stackMarquee');
  if (!root) return;
  const html = stack.map(chip).join('');
  root.innerHTML = `
    <div class="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div class="flex w-max gap-3 animate-marquee">${html}${html}</div>
    </div>
    <div class="mt-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div class="flex w-max gap-3 animate-marquee-reverse">${html}${html}</div>
    </div>
  `;
}
