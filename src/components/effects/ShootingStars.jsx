import { useEffect, useState } from "react";
import "./ShootingStars.css";

function ShootingStars() {
  const [star, setStar] = useState(null);

  useEffect(() => {
    let timeout;

    const createShootingStar = () => {
      const newStar = {
        id: Date.now(),

        // Start somewhere near the upper half of the screen
        top: Math.random() * 45 + 5,

        // Start from outside the right side
        right: Math.random() * 25 - 5,

        // Slightly different speed each time
        duration: Math.random() * 0.8 + 1.2,
      };

      setStar(newStar);

      // Remove it after the animation finishes
      setTimeout(() => {
        setStar(null);
      }, newStar.duration * 1000 + 200);

      // Wait before the next shooting star
      timeout = setTimeout(
        createShootingStar,
        Math.random() * 12000 + 9000
      );
    };

    // Don't immediately show one.
    // Let Meghuuu experience the atmosphere first.
    timeout = setTimeout(
      createShootingStar,
      Math.random() * 7000 + 5000
    );

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!star) return null;

  return (
    <div
      key={star.id}
      className="shooting-star"
      style={{
        top: `${star.top}%`,
        right: `${star.right}%`,
        animationDuration: `${star.duration}s`,
      }}
    />
  );
}

export default ShootingStars;