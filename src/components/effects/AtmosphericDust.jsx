import "./AtmosphericDust.css";

const DUST_COUNT = 70;

function AtmosphericDust() {
  const particles = Array.from({ length: DUST_COUNT });

  return (
    <div className="dust">
      {particles.map((_, index) => (
        <span
          key={index}
          className="dust-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 12}s`,
            animationDuration: `${12 + Math.random() * 15}s`,
            opacity: Math.random() * 0.25 + 0.05,
            transform: `scale(${Math.random() * 0.8 + 0.4})`,
          }}
        />
      ))}
    </div>
  );
}

export default AtmosphericDust;