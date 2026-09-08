// Renders three blurred radial blobs into a fixed container.
// CSS keyframes do the drifting; this just injects markup if absent.
export function mountGradientMesh(targetSelector = '#gradient-mesh') {
  const mount = document.querySelector(targetSelector);
  if (!mount) return;
  if (mount.dataset.mounted === 'true') return;

  mount.innerHTML = `
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div class="absolute top-[-20%] left-[-10%] h-[60vmax] w-[60vmax] rounded-full opacity-30 blur-3xl animate-mesh-drift-1"
           style="background: radial-gradient(closest-side, #16a34a, transparent 70%);"></div>
      <div class="absolute top-[20%] right-[-15%] h-[55vmax] w-[55vmax] rounded-full opacity-25 blur-3xl animate-mesh-drift-2"
           style="background: radial-gradient(closest-side, #65a30d, transparent 70%);"></div>
      <div class="absolute bottom-[-30%] left-[10%] h-[50vmax] w-[50vmax] rounded-full opacity-20 blur-3xl animate-mesh-drift-3"
           style="background: radial-gradient(closest-side, #0d9488, transparent 70%);"></div>
      <div class="absolute inset-0 dot-grid"></div>
    </div>
  `;
  mount.dataset.mounted = 'true';
}
