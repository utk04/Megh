import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import constellationMemories from "../../../data/constellationMemories";

import "./ConstellationWorld.css";

// ============================================================
// COMPONENT
// ============================================================

function ConstellationWorld({
  visible,
  onComplete,
}) {
  // ==========================================================
  // STATE
  // ==========================================================

  const [activeMemory, setActiveMemory] =
    useState(null);

  const [closingMemory, setClosingMemory] =
    useState(false);

  const [introVisible, setIntroVisible] =
    useState(true);

  const [revealedStars, setRevealedStars] =
    useState([]);

  // ==========================================================
  // REFS
  // ==========================================================

  const timersRef = useRef([]);

  const audioRef = useRef(null);

  // ==========================================================
  // STAR TONES
  // ==========================================================

  const starTones = useMemo(
    () => [
      "A4",
      "C5",
      "E5",
      "G5",
      "B5",
      "D6",
    ],
    []
  );

  // ==========================================================
  // AUDIO
  //
  // Same lifecycle logic as MagicWorld:
  //
  // visible
  //   → reset
  //   → play
  //
  // hidden
  //   → pause
  //   → reset
  //
  // The first interaction inside the world is also used
  // as a fallback if browser autoplay is blocked.
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
          "Unable to start Constellation World music:",
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
  // CLEAR TIMERS
  // ==========================================================

  const clearTimers = () => {
    timersRef.current.forEach(
      (timer) => {
        clearTimeout(timer);
      }
    );

    timersRef.current = [];
  };

  // ==========================================================
  // WORLD OPEN / CLOSE
  // ==========================================================

  useEffect(() => {
    clearTimers();

    if (!visible) {
      setActiveMemory(null);
      setClosingMemory(false);
      setIntroVisible(true);
      setRevealedStars([]);

      return;
    }

    setActiveMemory(null);
    setClosingMemory(false);
    setIntroVisible(true);
    setRevealedStars([]);

    // --------------------------------------------------------
    // Reveal stars one by one
    // --------------------------------------------------------

    constellationMemories.forEach(
      (_, index) => {
        const timer =
          window.setTimeout(() => {
            setRevealedStars(
              (current) => [
                ...current,
                index,
              ]
            );
          }, 900 + index * 650);

        timersRef.current.push(timer);
      }
    );

    // --------------------------------------------------------
    // Hide intro
    // --------------------------------------------------------

    const introTimer =
      window.setTimeout(() => {
        setIntroVisible(false);
      }, 6200);

    timersRef.current.push(
      introTimer
    );

    return clearTimers;
  }, [visible]);

  // ==========================================================
  // OPEN MEMORY
  // ==========================================================

  const openMemory = (memory) => {
    setClosingMemory(false);
    setActiveMemory(memory);
  };

  // ==========================================================
  // CLOSE MEMORY
  // ==========================================================

  const closeMemory = () => {
    if (!activeMemory || closingMemory) {
      return;
    }

    setClosingMemory(true);

    const timer =
      window.setTimeout(() => {
        setActiveMemory(null);
        setClosingMemory(false);
      }, 1050);

    timersRef.current.push(timer);
  };

  // ==========================================================
  // COMPLETE WORLD
  // ==========================================================

  const handleComplete = () => {
    if (activeMemory) {
      return;
    }

    // Stop music immediately.
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (onComplete) {
      onComplete();
    }
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
      className="constellation-world"
      onPointerDown={playMusic}
    >

      {/* ======================================================
          AUDIO
          ====================================================== */}

      <audio
        ref={audioRef}
        src="/audio/ilu.mp3"
        preload="auto"
        loop
      />

      {/* ======================================================
          SKY
          ====================================================== */}

      <div
        className="constellation-sky"
        aria-hidden="true"
      />

      {/* ======================================================
          NEBULAS
          ====================================================== */}

      <div
        className="constellation-nebula nebula-one"
        aria-hidden="true"
      />

      <div
        className="constellation-nebula nebula-two"
        aria-hidden="true"
      />

      <div
        className="constellation-nebula nebula-three"
        aria-hidden="true"
      />

      {/* ======================================================
          DUST
          ====================================================== */}

      <div
        className="constellation-dust"
        aria-hidden="true"
      />

      <div
        className="distant-stars"
        aria-hidden="true"
      />

      {/* ======================================================
          HEADER
          ====================================================== */}

      <header className="constellation-header">

        <div className="constellation-brand">

          <span className="brand-star">
            ✦
          </span>

          <span>
            A LITTLE CONSTELLATION
          </span>

        </div>

        <div className="constellation-hint">
          <span>
            some stars are yours
          </span>

          <br />

          <small>
            click one when it calls you
          </small>
        </div>

      </header>

      {/* ======================================================
          INTRO
          ====================================================== */}

      {introVisible && (
        <div className="constellation-intro">

          <p className="constellation-intro-line">
            somewhere between all these stars...
          </p>

          <h1>
            I found
            <br />
            little pieces
            <br />
            of you.
          </h1>

          <p className="constellation-intro-sub">
            six memories, floating somewhere
            in our little universe.
          </p>

        </div>
      )}

      {/* ======================================================
          STARS
          ====================================================== */}

      <div
        className="constellation-stars"
        aria-label="Constellation memories"
      >

        {constellationMemories.map(
          (memory, index) => {
            const isVisible =
              revealedStars.includes(index);

            const isActive =
              activeMemory?.id === memory.id;

            return (
              <button
                key={memory.id}
                type="button"
                className={`
                  constellation-star
                  star-${memory.color || "silver"}
                  star-${memory.size || "medium"}
                  ${
                    isVisible
                      ? "star-visible"
                      : ""
                  }
                  ${
                    isActive
                      ? "star-active"
                      : ""
                  }
                `}
                style={{
                  left: `${memory.x}%`,
                  top: `${memory.y}%`,
                }}
                onClick={() =>
                  openMemory(memory)
                }
                aria-label={
                  memory.title ||
                  `Open memory ${index + 1}`
                }
                disabled={!isVisible}
              >

                <span className="star-aura" />

                <span className="star-rays" />

                <span className="star-core" />

              </button>
            );
          }
        )}

      </div>

      {/* ======================================================
          INSTRUCTION
          ====================================================== */}

      {!activeMemory && (
        <div className="constellation-instruction">

          <div className="instruction-icon">
            ✦
          </div>

          <div>
            <span>
              find the memories
            </span>

            <small>
              each little star holds something
            </small>
          </div>

        </div>
      )}

      {/* ======================================================
          MEMORY COUNTER
          ====================================================== */}

      {!activeMemory && (
        <div className="memory-counter">

          <span className="counter-title">
            MEMORIES FOUND
          </span>

          <div className="counter-stars">

            {constellationMemories.map(
              (_, index) => (
                <span
                  key={index}
                  className={
                    revealedStars.includes(
                      index
                    )
                      ? "counter-star is-found"
                      : "counter-star"
                  }
                >
                  ✦
                </span>
              )
            )}

          </div>

        </div>
      )}

      {/* ======================================================
          EXIT
          ====================================================== */}

      {!activeMemory && (
        <button
          type="button"
          className="constellation-exit"
          onClick={handleComplete}
        >
          leave the stars

          <span>
            →
          </span>
        </button>
      )}

      {/* ======================================================
          MEMORY OVERLAY
          ====================================================== */}

      {activeMemory && (
        <div
          className={`
            memory-overlay
            ${
              closingMemory
                ? "memory-closing"
                : ""
            }
          `}
        >

          {/* ==================================================
              MEMORY ATMOSPHERE
              ================================================== */}

          <div
            className="memory-atmosphere"
            aria-hidden="true"
          >
            {Array.from({
              length: 28,
            }).map((_, index) => (
              <span
                key={index}
                style={{
                  left:
                    `${(index * 37) % 100}%`,

                  top:
                    `${12 + ((index * 23) % 76)}%`,

                  animationDelay:
                    `${(index * 0.17) % 3}s`,
                }}
              />
            ))}
          </div>

          {/* ==================================================
              RETURN STAR
              ================================================== */}

          <div
            className="memory-return-star"
            aria-hidden="true"
          />

          {/* ==================================================
              MEMORY CARD
              ================================================== */}

          <article className="memory-content">

            <button
              type="button"
              className="memory-close"
              onClick={closeMemory}
              aria-label="Close memory"
            >
              ×
            </button>

            {/* ================================================
                TEXT
                ================================================ */}

            <div className="memory-text">

              <div className="memory-star">
                ✦
              </div>

              <p className="memory-date">
                {activeMemory.date}
              </p>

              <h2>
                {activeMemory.title}
              </h2>

              <div className="memory-divider">
                <span />
                <b>♡</b>
                <span />
              </div>

              <p className="memory-message">
                {activeMemory.message}
              </p>

            </div>

            {/* ================================================
                IMAGE
                ================================================ */}

            {activeMemory.image ? (
              <div className="memory-image-frame">

                <div className="memory-image-glow" />

                <div className="memory-image-wrapper">

                  <img
                    src={activeMemory.image}
                    alt={
                      activeMemory.title
                    }
                    className="memory-image"
                  />

                </div>

              </div>
            ) : (
              <div className="memory-placeholder">
                <span>
                  your photo will live here
                </span>
              </div>
            )}

          </article>

        </div>
      )}

    </section>
  );
}

export default ConstellationWorld;