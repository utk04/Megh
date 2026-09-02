import { useEffect, useRef, useState } from "react";
import "./MagicWorld.css";

const FLOWERS = [
  { left: "14%", top: "68%" },
  { left: "27%", top: "78%" },
  { left: "40%", top: "70%" },
  { left: "62%", top: "73%" },
  { left: "75%", top: "66%" },
  { left: "88%", top: "76%" },
];

const FIREFLIES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${4 + ((i * 37) % 92)}%`,
  top: `${12 + ((i * 43) % 76)}%`,
  delay: `${(i * 0.23) % 4}s`,
  duration: `${3.2 + (i % 5) * 0.5}s`,
}));

const NOTE = [
  "I don't really know when it happened...",
  "when you slowly became such an important part of my world.",
  "Maybe it was hidden in all those little conversations,",
  "the random laughs, the silly moments,",
  "and all the memories that somehow became special.",
  "",
  "But somewhere along the way...",
  "you became someone I never wanted my world without.",
];

const BURST = ["✦", "✧", "•", "✦", "♡", "✧"];

function MagicWorld({ visible = true, onComplete }) {
  const [bloomed, setBloomed] = useState([]);
  const [magic, setMagic] = useState(false);
  const [envelopeVisible, setEnvelopeVisible] = useState(false);
  const [opened, setOpened] = useState(false);
  const [lines, setLines] = useState(0);
  const [portal, setPortal] = useState(false);
  const [closing, setClosing] = useState(false);
  const [bursts, setBursts] = useState([]);

  const timers = useRef([]);
  const started = useRef(false);

  /* =========================================================
     MUSIC
     ========================================================= */

  const musicRef = useRef(null);

  const startMusic = () => {
    const audio = musicRef.current;

    if (!audio) return;

    audio.loop = true;

    if (audio.paused) {
      audio
        .play()
        .catch(() => {
          /*
           * Browser may block autoplay.
           * The next user interaction will try again.
           */
        });
    }
  };

  const stopMusic = () => {
    const audio = musicRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  };

  /* =========================================================
     TIMER HELPERS
     ========================================================= */

  const later = (fn, ms) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  /* =========================================================
     WORLD INITIALIZATION
     ========================================================= */

  useEffect(() => {
    clearTimers();

    if (!visible) {
      setBloomed([]);
      setMagic(false);
      setEnvelopeVisible(false);
      setOpened(false);
      setLines(0);
      setPortal(false);
      setClosing(false);
      setBursts([]);
      started.current = false;

      stopMusic();

      return clearTimers;
    }

    setBloomed([]);
    setMagic(false);
    setEnvelopeVisible(false);
    setOpened(false);
    setLines(0);
    setPortal(false);
    setClosing(false);
    setBursts([]);
    started.current = false;

    /*
     * Reset and prepare the music.
     */
    const audio = musicRef.current;

    if (audio) {
      audio.loop = true;
      audio.currentTime = 0;
      audio.volume = 0.75;
    }

    /*
     * Give the world a short quiet entrance.
     */
    later(() => {
      setMagic(true);

      /*
       * Try to start the music when the world wakes up.
       */
      startMusic();
    }, 1400);

    return clearTimers;
  }, [visible]);

  /* =========================================================
     FLOWER BURST
     ========================================================= */

  const flowerBurst = (index) => {
    const burstId = `${index}-${Date.now()}`;

    setBursts((current) => [
      ...current,
      {
        id: burstId,
        left: FLOWERS[index].left,
        top: FLOWERS[index].top,
      },
    ]);

    later(() => {
      setBursts((current) =>
        current.filter(
          (item) => item.id !== burstId
        )
      );
    }, 900);
  };

  /* =========================================================
     BLOOM FLOWER
     ========================================================= */

  const bloom = (index) => {
    /*
     * If autoplay was blocked, this click is a user
     * interaction, so use it to start the music.
     */
    startMusic();

    if (
      bloomed.includes(index) ||
      magic === false ||
      envelopeVisible
    ) {
      return;
    }

    flowerBurst(index);

    setBloomed((current) => {
      if (current.includes(index)) {
        return current;
      }

      return [...current, index];
    });
  };

  /* =========================================================
     NOTE ARRIVAL
     ========================================================= */

  useEffect(() => {
    if (
      !visible ||
      bloomed.length !== FLOWERS.length ||
      started.current
    ) {
      return;
    }

    started.current = true;

    later(() => setMagic(false), 250);

    later(
      () => setEnvelopeVisible(true),
      2700
    );
  }, [bloomed, visible]);

  /* =========================================================
     OPEN LETTER
     ========================================================= */

  const openLetter = () => {
    /*
     * Make absolutely sure the music is playing.
     */
    startMusic();

    if (opened) return;

    setOpened(true);
    setEnvelopeVisible(false);
    setLines(0);

    NOTE.forEach((_, index) => {
      later(
        () => setLines(index + 1),
        650 + index * 720
      );
    });

    later(
      () => {
        setPortal(true);
      },
      650 + NOTE.length * 720 + 900
    );
  };

  /* =========================================================
     FINISH WORLD
     ========================================================= */

  const finish = () => {
    if (closing) return;

    /*
     * Stop the music when she chooses to leave
     * this world.
     */
    stopMusic();

    setClosing(true);

    later(
      () => onComplete?.(),
      1100
    );
  };

  /* =========================================================
     HIDDEN
     ========================================================= */

  if (!visible) {
    return null;
  }

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <section
      className={`magic-world ${
        magic ? "is-awake" : ""
      } ${
        envelopeVisible ? "has-note" : ""
      } ${
        opened ? "is-opened" : ""
      } ${
        closing ? "is-closing" : ""
      }`}
    >

      {/* =====================================================
          MUSIC
          ===================================================== */}

      <audio
        ref={musicRef}
        src="/audio/d2.mp3"
        preload="auto"
        loop
      />

      {/* =====================================================
          SKY
          ===================================================== */}

      <div
        className="mw-sky"
        aria-hidden="true"
      >
        <div className="mw-sun" />

        <div className="mw-cloud c1" />
        <div className="mw-cloud c2" />
        <div className="mw-cloud c3" />

        <div className="mw-moon" />
      </div>

      {/* =====================================================
          LANDSCAPE
          ===================================================== */}

      <div
        className="mw-land"
        aria-hidden="true"
      >
        <div className="mw-hill h1" />
        <div className="mw-hill h2" />
        <div className="mw-hill h3" />

        <div className="mw-path" />

        <div className="mw-tree left">
          <i />
          <i />
          <i />
        </div>

        <div className="mw-tree right">
          <i />
          <i />
          <i />
        </div>

        <div className="mw-arch">
          <span />
        </div>
      </div>

      {/* =====================================================
          BACKGROUND SPARKLES
          ===================================================== */}

      <div
        className="mw-particles"
        aria-hidden="true"
      >
        {Array.from(
          { length: 34 },
          (_, i) => (
            <span
              key={i}
              style={{
                left: `${(i * 31) % 100}%`,
                top: `${
                  12 +
                  ((i * 43) % 72)
                }%`,
                animationDelay: `${
                  (i * 0.19) % 4
                }s`,
              }}
            />
          )
        )}
      </div>

      {/* =====================================================
          FIREFLIES
          ===================================================== */}

      <div
        className="mw-fireflies"
        aria-hidden="true"
      >
        {FIREFLIES.map(
          (firefly) => (
            <span
              key={firefly.id}
              className="mw-firefly"
              style={{
                left: firefly.left,
                top: firefly.top,
                animationDelay:
                  firefly.delay,
                animationDuration:
                  firefly.duration,
              }}
            />
          )
        )}
      </div>

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="mw-header">
        <div className="mw-kicker">
          A LITTLE WORLD, MADE JUST FOR YOU
        </div>

        <strong>
          Meghuuu <span>♡</span>
        </strong>
      </header>

      {/* =====================================================
          MAIN COPY
          ===================================================== */}

      <main className="mw-copy">
        <small>
          before I tell you
        </small>

        <h1>
          what you mean
          <br />
          <em>to me...</em>
        </h1>

        <p>
          let me take you somewhere
          <br />
          a little more magical.
        </p>

        <label>
          {bloomed.length === 0
            ? "there's something waiting for you..."
            : bloomed.length <
              FLOWERS.length
            ? `${
                FLOWERS.length -
                bloomed.length
              } little flowers are still sleeping...`
            : "something magical is coming..."}
        </label>
      </main>

      {/* =====================================================
          FLOWERS
          ===================================================== */}

      <div className="mw-flowers">
        {FLOWERS.map(
          (flower, index) => {
            const isBloomed =
              bloomed.includes(index);

            return (
              <button
                key={index}
                className={`mw-flower ${
                  isBloomed
                    ? "bloomed"
                    : "sleeping"
                }`}
                style={{
                  left: flower.left,
                  top: flower.top,
                }}
                onClick={() =>
                  bloom(index)
                }
                aria-label={
                  isBloomed
                    ? "Bloomed flower"
                    : "Wake up this little flower"
                }
              >
                <span
                  className="flower-hint"
                  aria-hidden="true"
                >
                  ✦
                </span>

                <span
                  className="stem"
                  aria-hidden="true"
                />

                <span
                  className="head"
                  aria-hidden="true"
                >
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <b />
                </span>
              </button>
            );
          }
        )}
      </div>

      {/* =====================================================
          FLOWER CLICK BURSTS
          ===================================================== */}

      <div
        className="mw-bursts"
        aria-hidden="true"
      >
        {bursts.map(
          (burst) => (
            <div
              className="mw-burst"
              key={burst.id}
              style={{
                left: burst.left,
                top: burst.top,
              }}
            >
              {BURST.map(
                (symbol, i) => (
                  <span
                    key={i}
                    style={{
                      "--angle": `${
                        i * 60
                      }deg`,
                      "--distance": `${
                        28 +
                        (i % 3) * 12
                      }px`,
                    }}
                  >
                    {symbol}
                  </span>
                )
              )}
            </div>
          )
        )}
      </div>

      {/* =====================================================
          NOTE ARRIVAL MAGIC
          ===================================================== */}

      {envelopeVisible &&
        !opened && (
          <div
            className="mw-note-arrival"
            aria-hidden="true"
          >
            <div className="mw-gather-glow" />

            <div className="mw-gather-lights">
              {Array.from(
                { length: 18 },
                (_, i) => (
                  <span
                    key={i}
                    style={{
                      "--sx": `${
                        (i * 29) % 88
                      }%`,
                      "--sy": `${
                        18 +
                        ((i * 41) %
                          65)
                      }%`,
                      "--delay": `${
                        i * 0.07
                      }s`,
                    }}
                  />
                )
              )}
            </div>

            <div className="mw-note-message">
              <span>
                the little things came together...
              </span>

              <b>
                something is here for you ✦
              </b>
            </div>
          </div>
        )}

      {/* =====================================================
          ENVELOPE
          ===================================================== */}

      {envelopeVisible &&
        !opened && (
          <div className="mw-envelope-wrap">
            <button
              className="mw-envelope"
              onClick={openLetter}
              aria-label="Open the letter"
            >
              <span className="env-paper">
                <small>
                  for you,
                </small>

                <b>
                  Meghuuu
                </b>
              </span>

              <span className="env-body" />
              <span className="env-flap" />

              <span className="env-seal">
                ♡
              </span>

              <span
                className="env-sparkles"
                aria-hidden="true"
              >
                <i>✦</i>
                <i>✧</i>
                <i>•</i>
                <i>✦</i>
                <i>♡</i>
              </span>
            </button>

            <div className="mw-envelope-hint">
              there's a little note inside ✦
            </div>
          </div>
        )}

      {/* =====================================================
          LETTER
          ===================================================== */}

      {opened &&
        !portal && (
          <div className="mw-letter-wrap">
            <article className="mw-letter">
              <div className="letter-star">
                ✦
              </div>

              <header>
                <span>
                  for the girl who made
                </span>

                <b>
                  my world a little more magical...
                </b>
              </header>

              <div className="letter-lines">
                {NOTE.map(
                  (text, index) => (
                    <p
                      key={index}
                      className={
                        index < lines
                          ? "show"
                          : ""
                      }
                    >
                      {text ||
                        "\u00a0"}
                    </p>
                  )
                )}
              </div>

              <footer>
                with a little more to say...
                <b>♡</b>
              </footer>
            </article>
          </div>
        )}

      {/* =====================================================
          NEXT WORLD
          ===================================================== */}

      {portal && (
        <div className="mw-portal-screen">
          <div
            className="mw-portal"
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
          </div>

          <div className="mw-portal-copy">
            <small>
              the first little world ends here...
            </small>

            <h2>
              shall we go?
            </h2>

            <button
              onClick={finish}
            >
              enter the sunshine
              <b>→</b>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          INITIAL HINT
          ===================================================== */}

      {!opened &&
        !envelopeVisible && (
          <div className="mw-hint">
            Find Some Stars 

            <small>
              you might wake something up ✦
            </small>
          </div>
        )}

      {/* =====================================================
          MUSIC LABEL
          ===================================================== */}

      <div className="mw-music">
        ♪
        <span>
          best experienced with music
        </span>
      </div>

    </section>
  );
}

export default MagicWorld;