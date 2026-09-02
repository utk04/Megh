import { useEffect, useRef, useState } from "react";

import "./SunflowerWorld.css";

// ============================================================
// MEMORY PHOTOS
// ============================================================

const flowerPhotos = [
  "/sunflower/p1.jpg",
  "/sunflower/p2.jpg",
  "/sunflower/p3.jpg",
  "/sunflower/p4.jpg",
  "/sunflower/p5.jpg",
  "/sunflower/p6.jpg",
  "/sunflower/p7.jpg",
  "/sunflower/p8.jpg",
];

// ============================================================
// MEMORY POSITIONS
//
// 8 photos = 8 positions
//
// These are deliberately spread around the whole frame.
// They are NOT connected to cursor movement.
// ============================================================

const memoryPositions = [
  { x: 7, y: 14 },
  { x: 93, y: 14 },

  { x: 5, y: 38 },
  { x: 95, y: 38 },

  { x: 5, y: 63 },
  { x: 95, y: 63 },

  { x: 11, y: 84 },
  { x: 89, y: 84 },
];

// ============================================================
// OPENING PETALS
// ============================================================

const createPetals = () =>
  Array.from({ length: 54 }, (_, id) => ({
    id,
    x: Math.random() * 100,
    delay: Math.random() * 3.5,
    duration: 5.5 + Math.random() * 4,
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    drift: -65 + Math.random() * 130,
  }));

// ============================================================
// COMPONENT
// ============================================================

function SunflowerWorld({
  visible,
  onComplete,
}) {
  // ----------------------------------------------------------
  // OPENING PHASE
  // ----------------------------------------------------------

  const [openingPhase, setOpeningPhase] =
    useState("intro");

  // ----------------------------------------------------------
  // MEMORY PHOTOS
  // ----------------------------------------------------------

  const [flowers, setFlowers] =
    useState([]);

  // ----------------------------------------------------------
  // CLOSING
  // ----------------------------------------------------------

  const [closing, setClosing] =
    useState(false);

  // ----------------------------------------------------------
  // PETALS
  // ----------------------------------------------------------

  const [petals] =
    useState(createPetals);

  // ----------------------------------------------------------
  // AUDIO
  // ----------------------------------------------------------

  const audioRef = useRef(null);

  // ----------------------------------------------------------
  // TIMERS
  // ----------------------------------------------------------

  const portraitTimer =
    useRef(null);

  const dissolveTimer =
    useRef(null);

  const worldTimer =
    useRef(null);

  const closeTimer =
    useRef(null);

  // ==========================================================
  // AUDIO PLAYBACK
  //
  // Same lifecycle logic as the other worlds:
  //
  // visible  → reset + play
  // hidden   → pause + reset
  //
  // If autoplay is blocked, the world itself still works.
  // A later user interaction can unlock the audio.
  // ==========================================================

  const playMusic = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio
      .play()
      .catch((error) => {
        console.warn(
          "Unable to start Sunflower World music:",
          error
        );
      });
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!visible) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    audio.pause();
    audio.currentTime = 0;

    playMusic();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [visible]);

  // ==========================================================
  // CLEANUP TIMERS
  // ==========================================================

  const clearTimers = () => {
    [
      portraitTimer,
      dissolveTimer,
      worldTimer,
      closeTimer,
    ].forEach((timer) => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    });
  };

  // ==========================================================
  // OPENING SEQUENCE
  //
  // intro
  //   ↓
  // petals
  //   ↓
  // dissolve
  //   ↓
  // world
  //
  // IMPORTANT:
  // There is NO cursor movement logic.
  // ==========================================================

  useEffect(() => {
    clearTimers();

    if (!visible) {
      setOpeningPhase("intro");
      setFlowers([]);
      setClosing(false);

      return;
    }

    setOpeningPhase("intro");
    setFlowers([]);
    setClosing(false);

    // --------------------------------------------------------
    // INTRO → PETALS
    // --------------------------------------------------------

    portraitTimer.current =
      window.setTimeout(() => {
        setOpeningPhase("petals");
      }, 900);

    // --------------------------------------------------------
    // PETALS → DISSOLVE
    // --------------------------------------------------------

    dissolveTimer.current =
      window.setTimeout(() => {
        setOpeningPhase("dissolve");
      }, 5600);

    // --------------------------------------------------------
    // DISSOLVE → ACTUAL WORLD
    // --------------------------------------------------------

    worldTimer.current =
      window.setTimeout(() => {
        setOpeningPhase("world");
      }, 7000);

    return clearTimers;
  }, [visible]);

  // ==========================================================
  // MEMORY PHOTOS
  //
  // Automatically appear one by one.
  //
  // NO CURSOR
  // NO POINTERMOVE
  // NO RANDOM POSITIONING
  // ==========================================================

  useEffect(() => {
    if (
      !visible ||
      openingPhase !== "world"
    ) {
      return;
    }

    const timers = [];

    memoryPositions.forEach(
      (position, index) => {
        const timer =
          window.setTimeout(() => {
            setFlowers((current) => {
              // Prevent duplicate photos
              if (
                current.some(
                  (flower) =>
                    flower.id === index
                )
              ) {
                return current;
              }

              return [
                ...current,
                {
                  id: index,

                  // One photo for each position
                  photo:
                    flowerPhotos[index],

                  x: position.x,
                  y: position.y,

                  // Slightly larger hanging photos
                  size:
                    100 +
                    (index % 3) * 7,

                  rotation:
                    index % 2 === 0
                      ? -4
                      : 4,

                  stringLength:
                    30 +
                    (index % 3) * 5,

                  swing:
                    5.5 +
                    (index % 2) * 0.8,

                  delay: 0,
                },
              ];
            });
          },
          900 + index * 900
        );

        timers.push(timer);
      }
    );

    return () => {
      timers.forEach(
        (timer) =>
          clearTimeout(timer)
      );
    };
  }, [
    visible,
    openingPhase,
  ]);

  // ==========================================================
  // REMOVE MEMORY
  // ==========================================================

  const removeFlower = (id) => {
    setFlowers((current) =>
      current.filter(
        (flower) =>
          flower.id !== id
      )
    );
  };

  // ==========================================================
  // COMPLETE WORLD
  // ==========================================================

  const handleComplete = () => {
    if (closing) {
      return;
    }

    // Stop music immediately when leaving
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setClosing(true);

    closeTimer.current =
      window.setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 900);
  };

  // ==========================================================
  // HIDDEN
  // ==========================================================

  if (!visible) {
    return null;
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section
      className={`
        sunflower-world
        ${
          closing
            ? "sunflower-world-closing"
            : ""
        }
      `}
      onPointerDown={playMusic}
    >

      {/* ======================================================
          AUDIO
          ====================================================== */}

      <audio
        ref={audioRef}
        src="/audio/aanchal.mp3"
        preload="auto"
        loop
      />

      {/* ======================================================
          BACKGROUND
          ====================================================== */}

      <div
        className="sunflower-background"
        aria-hidden="true"
      >
        <div className="sunflower-background-image" />

        <div className="sunflower-background-vignette" />

        <div className="sunflower-background-glow" />

        <div className="sunflower-background-grain" />

        <div className="sunflower-background-breeze" />
      </div>

      {/* ======================================================
          ATMOSPHERE
          ====================================================== */}

      <div
        className="sunflower-atmosphere"
        aria-hidden="true"
      >
        <div className="sunflower-distant-dots" />

        <div className="sunflower-pollen">
          {Array.from({
            length: 24,
          }).map((_, index) => (
            <span
              key={index}
              style={{
                "--pollen-x":
                  `${(index * 43) % 100}%`,

                "--pollen-y":
                  `${15 + ((index * 19) % 70)}%`,

                "--pollen-delay":
                  `${(index * 0.51) % 5}s`,

                "--pollen-duration":
                  `${6 + ((index * 0.71) % 4)}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ======================================================
          HEADER
          ====================================================== */}

      <header className="sunflower-header">
        <div className="sunflower-brand">

          <span className="sunflower-brand-icon">
            🌻
          </span>

          <span>
            A LITTLE SUNSHINE
          </span>

          <span className="brand-heart">
            ♥
          </span>

        </div>
      </header>

      {/* ======================================================
          OPENING
          ====================================================== */}

      {openingPhase !== "world" && (
        <div
          className={`
            sunflower-opening
            sunflower-opening-${openingPhase}
          `}
        >

          <div className="opening-light" />

          <div className="opening-petals">

            {petals.map((petal) => (
              <span
                key={petal.id}
                className="opening-petal"
                style={{
                  "--petal-x":
                    `${petal.x}%`,

                  "--petal-delay":
                    `${petal.delay}s`,

                  "--petal-duration":
                    `${petal.duration}s`,

                  "--petal-size":
                    `${petal.size}px`,

                  "--petal-rotation":
                    `${petal.rotation}deg`,

                  "--petal-drift":
                    `${petal.drift}px`,
                }}
              />
            ))}

          </div>

          <div className="opening-message">

            <span>
              and then there was you...
            </span>

            <h1>
              somehow,
              <br />
              you made everything brighter.
            </h1>

          </div>

        </div>
      )}

      {/* ======================================================
          MAIN MEGHUU
          ====================================================== */}

      {openingPhase === "world" && (
        <div
          className="sunflower-hero"
          aria-hidden="true"
        >

          <div className="hero-art-glow" />

          <img
            src="/sunflower/meghu-illustrated-hero.png"
            alt=""
          />

        </div>
      )}

      {/* ======================================================
          STORY TEXT
          ====================================================== */}

      {openingPhase === "world" && (
        <div className="sunflower-story-copy">

          <span>
            AND THEN THERE WAS YOU...
          </span>

          <h1>
            somehow,
            <br />
            you made everything
            <br />
            brighter.
          </h1>

          <div className="story-heart">
            ♥
          </div>

        </div>
      )}

      {/* ======================================================
          HANGING MEMORIES
          ====================================================== */}

      <div className="memory-flower-layer">

        {flowers.map((flower) => (
          <div
            key={flower.id}
            className="memory-flower"
            style={{
              left:
                `${flower.x}%`,

              top:
                `${flower.y}%`,

              width:
                `${flower.size}px`,

              height:
                `${
                  flower.size +
                  flower.stringLength +
                  18
                }px`,

              "--memory-rotation":
                `${flower.rotation}deg`,

              "--memory-swing":
                `${flower.swing}s`,

              "--memory-delay":
                `${flower.delay}s`,

              "--memory-string":
                `${flower.stringLength}px`,
            }}
          >

            <div className="memory-flower-string" />

            <div className="memory-flower-frame">

              <div className="memory-flower-photo">

                <img
                  src={flower.photo}
                  alt="A beautiful memory of Meghuuu"
                  draggable="false"
                  onError={(event) => {
                    console.error(
                      "Could not load sunflower memory:",
                      flower.photo
                    );
                  }}
                />

              </div>

            </div>

            <button
              className="memory-flower-close"
              onClick={() =>
                removeFlower(flower.id)
              }
              aria-label="Close memory"
            >
              ×
            </button>

          </div>
        ))}

      </div>

      {/* ======================================================
          EXIT
          ====================================================== */}

      <button
        className="sunflower-exit"
        onClick={handleComplete}
      >
        leave the sunshine

        <span>
          →
        </span>
      </button>

    </section>
  );
}

export default SunflowerWorld;