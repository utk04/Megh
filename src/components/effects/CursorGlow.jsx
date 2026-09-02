import { useEffect, useRef } from "react";
import "./CursorGlow.css";

function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
  const glow = glowRef.current;

  if (!glow) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;

  let currentX = targetX;
  let currentY = targetY;

  let animationFrame;

  const handleMouseMove = (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  };

  const animate = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    animationFrame = requestAnimationFrame(animate);
  };

  window.addEventListener("mousemove", handleMouseMove);

  animationFrame = requestAnimationFrame(animate);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    cancelAnimationFrame(animationFrame);
  };
}, []);

  return <div ref={glowRef} className="cursor-glow" />;
}

export default CursorGlow;