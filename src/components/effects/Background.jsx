import Stars from "./Stars";
import AtmosphericDust from "./AtmosphericDust";
import Aurora from "./Aurora";
import ShootingStars from "./ShootingStars";

import { useExperience } from "../../context/ExperienceContext";

import "./Background.css";

function Background() {
  const { experienceStarted } = useExperience();

  return (
    <div
      className={`background ${
        experienceStarted ? "experience-started" : ""
      }`}
    >
      <Stars />

      <AtmosphericDust />

      <Aurora />

      <ShootingStars />
    </div>
  );
}

export default Background;