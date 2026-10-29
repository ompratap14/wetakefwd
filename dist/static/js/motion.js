const forwardScene = document.querySelector('.forward-scene');
if (forwardScene && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  forwardScene.addEventListener('pointermove', (event) => {
    if (!finePointer.matches) return;
    const bounds = forwardScene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    forwardScene.style.setProperty('--tilt-x', `${(-y * 6).toFixed(2)}deg`);
    forwardScene.style.setProperty('--tilt-y', `${(x * 7).toFixed(2)}deg`);
  });
  forwardScene.addEventListener('pointerleave', () => {
    forwardScene.style.setProperty('--tilt-x', '0deg');
    forwardScene.style.setProperty('--tilt-y', '0deg');
  });
}
