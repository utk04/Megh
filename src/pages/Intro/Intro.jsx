import { useState } from "react";

import Background from "../../components/effects/Background";
import CursorGlow from "../../components/effects/CursorGlow";
import BirthdayAudio from "../../components/effects/BirthdayAudio";
import VideoMoment from "../../components/sections/VideoMoment";
import ThisOrThat from "../../components/sections/ThisOrThat";
import WorldManager from "../../components/sections/WorldManager";

import "./Intro.css";

function Intro() {

  const [showIntro, setShowIntro] = useState(true);

  const [showSuspense, setShowSuspense] =
    useState(false);

  const [showVideo, setShowVideo] =
    useState(false);

  const [showThisOrThat, setShowThisOrThat] =
    useState(false);

  const [showWorldManager, setShowWorldManager] =
    useState(false);

  // IMPORTANT:
  // This becomes true ONLY after the birthday
  // audio has completely finished.
  const [audioFinished, setAudioFinished] =
    useState(false);


  /* =========================================
     AUDIO COMPLETE
     ========================================= */

  const handleAudioComplete = () => {

    console.log(
      "🎵 Birthday audio finished"
    );

    // Audio phase is permanently over
    setAudioFinished(true);

    // Remove Radhe Radhe
    setShowIntro(false);

    // Show suspense
    setShowSuspense(true);


    // After suspense
    setTimeout(() => {

      setShowSuspense(false);

      // Small breathing pause
      setTimeout(() => {

        setShowVideo(true);

      }, 900);

    }, 2600);
  };


  return (
    <main className="intro">

      <Background />

      <CursorGlow />


      {/* =====================================
          RADHE RADHE
      ===================================== */}

      {showIntro && (
        <div className="intro-content">

          <h1 className="intro-greeting">

            Radhe Radhe 🏵️

            <br />

            Meghuuu…

          </h1>

        </div>
      )}


      {/* =====================================
          BIRTHDAY AUDIO
          
          IMPORTANT:
          It remains mounted while audio
          is playing.
          
          It disappears ONLY after the
          audio has completely finished.
      ===================================== */}

      {!audioFinished &&
        !showVideo &&
        !showThisOrThat &&
        !showWorldManager && (

          <BirthdayAudio
            onComplete={
              handleAudioComplete
            }
          />

        )}


      {/* =====================================
          SUSPENSE
      ===================================== */}

      <div
        className={`suspense-message ${
          showSuspense
            ? "suspense-message-visible"
            : ""
        }`}
      >

        <p>
          Enough suspense... HUH?
        </p>

      </div>


      {/* =====================================
          VIDEO
      ===================================== */}

      <VideoMoment
        visible={showVideo}

        onComplete={() => {

          console.log(
            "🎬 Video finished"
          );

          setShowVideo(false);

          setTimeout(() => {

            setShowThisOrThat(true);

          }, 1000);

        }}
      />


      {/* =====================================
          THIS OR THAT
      ===================================== */}

      <ThisOrThat
  visible={showThisOrThat}
  onChoice={(choice) => {

    console.log(
      "She chose:",
      choice
    );

    setShowThisOrThat(false);

    setShowWorldManager(true);

  }}
/>


      {/* =====================================
          WORLD MANAGER
      ===================================== */}

      <WorldManager
  visible={showWorldManager}
  onWorldComplete={(world) => {

    console.log(
      "Completed world:",
      world
    );

    setShowWorldManager(false);

    setTimeout(() => {

      setShowThisOrThat(true);

    }, 1000);

  }}
/>

    </main>
  );
}

export default Intro;