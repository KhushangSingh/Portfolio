const edgeTolerance = 1;
const gestureGap = 180;

export function bindDemoScrollHandoff(viewport) {
  let gesture = null;
  let touch = null;

  function clearGesture() {
    gesture = null;
  }

  function atEdge(delta) {
    const limit = viewport.scrollHeight - viewport.clientHeight;
    return delta < 0
      ? viewport.scrollTop <= edgeTolerance
      : viewport.scrollTop >= limit - edgeTolerance;
  }

  function handOff(delta, time, input) {
    const direction = Math.sign(delta);
    if (gesture?.input !== input || gesture.direction !== direction || time - gesture.last > gestureGap) {
      gesture = { input, direction, first: time, last: time, distance: 0, active: false };
    }
    gesture.last = time;
    gesture.distance += Math.abs(delta);

    const elapsed = time - gesture.first;
    const sustained = elapsed >= 180 && gesture.distance >= 80;
    const strong = elapsed >= 90 && gesture.distance >= 220;
    gesture.active ||= sustained || strong;
    if (!gesture.active) return;

    const step = direction * Math.min(Math.abs(delta), 120);
    const lenis = window.__lenis;
    if (input === 'wheel' && lenis) {
      lenis.scrollTo(lenis.targetScroll + step, { programmatic: false, lerp: .15 });
    } else {
      window.scrollBy({ top: step, behavior: 'instant' });
    }
  }

  function onWheel(event) {
    const mode = event.deltaMode;
    const scale = mode === 1 ? 16 : mode === 2 ? viewport.clientHeight : 1;
    const delta = event.deltaY * scale;
    if (event.defaultPrevented || event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY) || !atEdge(delta)) {
      clearGesture();
      return;
    }
    if (event.cancelable) event.preventDefault();
    handOff(delta, event.timeStamp, 'wheel');
  }

  function onTouchStart(event) {
    touch = event.touches.length === 1 ? event.touches[0] : null;
    clearGesture();
  }

  function onTouchMove(event) {
    const previous = touch;
    touch = event.touches.length === 1 ? event.touches[0] : null;
    if (!previous || !touch || previous.identifier !== touch.identifier) {
      clearGesture();
      return;
    }
    const delta = previous.clientY - touch.clientY;
    if (Math.abs(previous.clientX - touch.clientX) >= Math.abs(delta) || !atEdge(delta)) {
      clearGesture();
      return;
    }
    handOff(delta, event.timeStamp, 'touch');
  }

  viewport.addEventListener('wheel', onWheel, { passive: false });
  viewport.addEventListener('pointerleave', clearGesture);
  viewport.addEventListener('touchstart', onTouchStart, { passive: true });
  viewport.addEventListener('touchmove', onTouchMove, { passive: true });
  viewport.addEventListener('touchend', onTouchStart, { passive: true });
  viewport.addEventListener('touchcancel', onTouchStart, { passive: true });
  return () => {
    viewport.removeEventListener('wheel', onWheel);
    viewport.removeEventListener('pointerleave', clearGesture);
    viewport.removeEventListener('touchstart', onTouchStart);
    viewport.removeEventListener('touchmove', onTouchMove);
    viewport.removeEventListener('touchend', onTouchStart);
    viewport.removeEventListener('touchcancel', onTouchStart);
  };
}
