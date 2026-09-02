import { createContext, useContext, useState } from "react";

const ExperienceContext = createContext(null);

export function ExperienceProvider({ children }) {
  const [experienceStarted, setExperienceStarted] = useState(false);

  const startExperience = () => {
    setExperienceStarted(true);
  };

  return (
    <ExperienceContext.Provider
      value={{
        experienceStarted,
        startExperience,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  return useContext(ExperienceContext);
}