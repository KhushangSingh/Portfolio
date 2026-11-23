import { useEffect, useRef, useState } from 'react';

const viewportStart = 0.12;

export default function ResearchCount({ total, suffix = '', delay = 0, className }) {
  const target = useRef(null);
  const canAnimate = typeof IntersectionObserver === 'function';
  const motionQuery = '(prefers-reduced-motion: reduce)';
  const [count, setCount] = useState(() =>
    !canAnimate || window.matchMedia(motionQuery).matches ? total : 0
  );

  useEffect(() => {
    if (!canAnimate) return;

    const motionPreference = window.matchMedia(motionQuery);
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < viewportStart || motionPreference.matches) return;
      observer.disconnect();

      let start;
      const tick = (time) => {
        start ??= time;
        const progress = Math.min(Math.max(0, time - start - delay) / 900, 1);
        setCount(Math.floor(total * (1 - (1 - progress) ** 1.35)));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: viewportStart });

    function stopAnimation() {
      observer.disconnect();
      cancelAnimationFrame(frame);
    }

    function honorReducedMotion() {
      if (!motionPreference.matches) return;
      stopAnimation();
      setCount(total);
    }

    if (motionPreference.matches) honorReducedMotion();
    else observer.observe(target.current);

    motionPreference.addEventListener('change', honorReducedMotion);
    return () => {
      stopAnimation();
      motionPreference.removeEventListener('change', honorReducedMotion);
    };
  }, [canAnimate, delay, motionQuery, total]);

  return (
    <span ref={target} className={className}>
      <span className="sr-only">{total}{suffix}</span>
      <span aria-hidden="true">{count}{suffix}</span>
    </span>
  );
}
