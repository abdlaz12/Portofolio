"use client";

import { useEffect, useRef } from "react";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const trail = trailRef.current;
    if (!dot || !ring || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let trailX = 0;
    let trailY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows instantly
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const animate = () => {
      // Ring lags behind — smooth lerp
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

      // Trail lags even more
      trailX += (mouseX - trailX) * 0.06;
      trailY += (mouseY - trailY) * 0.06;
      trail.style.transform = `translate(${trailX}px, ${trailY}px)`;

      rafId = requestAnimationFrame(animate);
    };

    const onMouseEnterLink = () => {
      ring.classList.add(styles.ringExpanded);
      dot.classList.add(styles.dotHidden);
    };

    const onMouseLeaveLink = () => {
      ring.classList.remove(styles.ringExpanded);
      dot.classList.remove(styles.dotHidden);
    };

    const onMouseDown = () => {
      ring.classList.add(styles.ringPressed);
      dot.classList.add(styles.dotPressed);
    };

    const onMouseUp = () => {
      ring.classList.remove(styles.ringPressed);
      dot.classList.remove(styles.dotPressed);
    };

    // Apply hover effect on all interactive elements
    const applyHoverEffect = () => {
      const interactives = document.querySelectorAll(
        "a, button, [role='button'], input, textarea, select, label, .cursor-pointer, [data-cursor]"
      );
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterLink);
        el.addEventListener("mouseleave", onMouseLeaveLink);
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    rafId = requestAnimationFrame(animate);
    applyHoverEffect();

    // Re-apply on DOM mutations (for dynamic content)
    const observer = new MutationObserver(applyHoverEffect);
    observer.observe(document.body, { childList: true, subtree: true });

    // Hide native cursor via CSS class
    document.body.classList.add("no-cursor");

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      document.body.classList.remove("no-cursor");
    };
  }, []);

  return (
    <>
      {/* Outer trailing glow */}
      <div ref={trailRef} className={styles.trail} aria-hidden="true" />
      {/* Lagging ring */}
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
      {/* Instant dot */}
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
    </>
  );
}
