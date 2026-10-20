import { useRef, useEffect, useCallback } from 'react';

/**
 * useTilt — cursor-responsive 3D perspective tilt with spring smoothing.
 *
 * @param maxDeg  Maximum tilt angle in degrees (default 3)
 * @param lift    translateZ lift in px on hover (default 6)
 * @param spring  Interpolation factor per frame 0-1 (default 0.08)
 */
export function useTilt<T extends HTMLElement>(
  maxDeg = 3,
  lift = 6,
  spring = 0.08,
) {
  const ref = useRef<T>(null);

  // Persist mutable state outside React state to avoid re-renders
  const state = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    hovering: false,
    rafId: 0,
  });

  const animate = useCallback(() => {
    const s = state.current;
    const el = ref.current;
    if (!el) return;

    // Spring interpolation
    s.currentX += (s.targetX - s.currentX) * spring;
    s.currentY += (s.targetY - s.currentY) * spring;

    // Snap to rest when close enough
    const dx = Math.abs(s.targetX - s.currentX);
    const dy = Math.abs(s.targetY - s.currentY);

    el.style.transform = `perspective(800px) rotateX(${s.currentY.toFixed(3)}deg) rotateY(${s.currentX.toFixed(3)}deg) translateZ(${s.hovering ? lift : 0}px)`;

    if (s.hovering || dx > 0.01 || dy > 0.01) {
      s.rafId = requestAnimationFrame(animate);
    }
  }, [spring, lift]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Disable for reduced-motion and touch-primary devices
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReduced || isTouch) return;

    const s = state.current;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Normalise cursor position to -1..1 range relative to card center
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      s.targetX = nx * maxDeg;
      s.targetY = -ny * maxDeg; // Invert Y for natural tilt
    };

    const onEnter = () => {
      s.hovering = true;
      cancelAnimationFrame(s.rafId);
      s.rafId = requestAnimationFrame(animate);
    };

    const onLeave = () => {
      s.hovering = false;
      s.targetX = 0;
      s.targetY = 0;
      // Continue animating back to rest
      cancelAnimationFrame(s.rafId);
      s.rafId = requestAnimationFrame(animate);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(s.rafId);
    };
  }, [maxDeg, animate]);

  return ref;
}
