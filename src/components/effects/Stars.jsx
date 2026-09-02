import { useEffect, useRef } from "react";
import "./Stars.css";

const STAR_LAYERS = [
  {
    name: "far",
    count: 90,
    movement: 4,
  },
  {
    name: "mid",
    count: 65,
    movement: 10,
  },
  {
    name: "near",
    count: 35,
    movement: 18,
  },
];

function createStars(count, layerName) {
  return Array.from({ length: count }, (_, index) => {
    let size;

    if (layerName === "far") {
      size = Math.random() * 1.2 + 0.4;
    } else if (layerName === "mid") {
      size = Math.random() * 1.8 + 0.6;
    } else {
      size = Math.random() * 2.5 + 0.8;
    }

    return {
      id: `${layerName}-${index}`,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size,
      opacity: Math.random() * 0.65 + 0.25,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 3,
    };
  });
}

function Stars() {
  const starsRef = useRef(null);

  useEffect(() => {
    const container = starsRef.current;

    if (!container) return;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let animationFrame;

    const handleMouseMove = (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      targetX = x;
      targetY = y;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      const layers = container.children;

      Array.from(layers).forEach((layer) => {
        const movement = Number(layer.dataset.movement);

        const translateX = currentX * movement;
        const translateY = currentY * movement;

        layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);

    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div ref={starsRef} className="stars">
      {STAR_LAYERS.map((layer) => {
        const stars = createStars(layer.count, layer.name);

        return (
          <div
            key={layer.name}
            className={`star-layer star-layer-${layer.name}`}
            data-movement={layer.movement}
          >
            {stars.map((star) => (
              <span
                key={star.id}
                className="star"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: star.opacity,
                  animationDelay: `${star.delay}s`,
                  animationDuration: `${star.duration}s`,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Stars;