import { useEffect, useRef, useState } from "react";

import birthdayVoice from "../../assets/music/Hpybday.m4a";
import { useExperience } from "../../context/ExperienceContext";

import "./BirthdayAudio.css";

function BirthdayAudio({ onComplete, onStart }) {
  const audioRef = useRef(null);
  const completionTimerRef = useRef(null);

  const { startExperience: activateExperience } =
    useExperience();

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);


  /* =========================================
     START AUDIO
     ========================================= */

  const startExperience = async () => {
    const audio = audioRef.current;

    if (!audio || started) return;

    try {
      await audio.play();

      /*
       * IMPORTANT:
       * Tell Intro that the one-time audio
       * experience has started.
       */
      if (onStart) {
        onStart();
      }

      setStarted(true);
      setPlaying(true);

      activateExperience();

    } catch (error) {
      console.error(
        "Unable to start birthday audio:",
        error
      );
    }
  };


  /* =========================================
     AUDIO ENDED
     ========================================= */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleEnded = () => {
      setPlaying(false);
      setFinished(true);

      /*
       * Give the ending of the audio a little
       * breathing room before showing the
       * suspense message.
       */
      completionTimerRef.current = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 1800);
    };

    audio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      audio.removeEventListener(
        "ended",
        handleEnded
      );

      if (completionTimerRef.current) {
        clearTimeout(
          completionTimerRef.current
        );
      }
    };
  }, [onComplete]);


  return (
    <>
      {/* =====================================
          AUDIO
      ===================================== */}

      <audio
        ref={audioRef}
        src={birthdayVoice}
        preload="auto"
      />


      {/* =====================================
          TAP TO BEGIN
      ===================================== */}

      {!started && !finished && (
        <button
          className="birthday-audio-trigger"
          onClick={startExperience}
        >
          <span className="audio-trigger-dot" />

          <span>tap to begin</span>
        </button>
      )}


      {/* =====================================
          AUDIO PLAYING
      ===================================== */}

      {playing && (
        <div className="audio-playing">
          <span className="audio-pulse" />

          <span>listen...</span>
        </div>
      )}


      {/* =====================================
          AUDIO FINISHED
      ===================================== */}

      {finished && (
        <div className="audio-finished">
          ✦
        </div>
      )}
    </>
  );
}

export default BirthdayAudio;