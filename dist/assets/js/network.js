(() => {
  'use strict';
  const scene = document.querySelector('[data-network]');
  if (!scene) return;
  const button = scene.querySelector('.motion-toggle');
  const label = button?.querySelector('span');
  const primary = scene.querySelector('[data-satellite="primary"]');
  const secondary = scene.querySelector('[data-satellite="secondary"]');
  if (!button || !label || !primary || !secondary) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  let inView = true;
  let animationFrame = null;
  let lastTime = null;
  let elapsed = 0;

  function placeOrb(element, theta, radiusX, radiusY, rotation) {
    const x = radiusX * Math.cos(theta);
    const y = radiusY * Math.sin(theta);
    element.setAttribute('cx', (390 + x * Math.cos(rotation) - y * Math.sin(rotation)).toFixed(2));
    element.setAttribute('cy', (340 + x * Math.sin(rotation) + y * Math.cos(rotation)).toFixed(2));
  }

  function frame(now) {
    if (lastTime !== null) elapsed += Math.min(now - lastTime, 100);
    lastTime = now;
    placeOrb(primary, elapsed / 34000 * Math.PI * 2, 325, 130, -Math.PI / 6);
    placeOrb(secondary, 2.35 - elapsed / 44000 * Math.PI * 2, 300, 185, Math.PI / 3);
    animationFrame = window.requestAnimationFrame(frame);
  }

  function sync() {
    const running = !userPaused && !reducedMotion.matches && inView && !document.hidden;
    scene.classList.toggle('is-running', running);
    if (!running && animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
      lastTime = null;
    }
    if (running && animationFrame === null) {
      lastTime = null;
      animationFrame = window.requestAnimationFrame(frame);
    }
    button.disabled = reducedMotion.matches;
    button.setAttribute('aria-pressed', String(userPaused));
    const text = reducedMotion.matches ? 'Motion reduced' : userPaused ? 'Play animation' : 'Pause animation';
    label.textContent = text;
    button.setAttribute('aria-label', reducedMotion.matches ? 'Animation disabled by your reduced-motion preference' : text + ' of the orbital graphic');
    button.title = reducedMotion.matches ? 'Your device’s reduced-motion setting is enabled.' : '';
    button.classList.toggle('is-paused', userPaused || reducedMotion.matches);
  }

  button.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  reducedMotion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      sync();
    }, {threshold:0.05});
    observer.observe(scene);
  }
  // With JavaScript off, the artwork remains static and the control stays hidden.
  button.hidden = false;
  sync();
})();
