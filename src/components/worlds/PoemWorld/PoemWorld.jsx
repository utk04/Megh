import { useEffect, useRef, useState } from "react";
import "./PoemWorld.css";

/* =========================================================
   LITTLE NOTES

   revealAt = percentage of the AUDIO duration.

   0.20 = 20% into poem
   0.48 = 48% into poem
   0.76 = 76% into poem
   ========================================================= */

const NOTES = [
  {
    id: 1,
    position: "left",
    revealAt: 0.20,

    preview: "there's something I never...",
    title: "a little promise",

    message:
      "I’ll always choose you,even on the ordinary days,even when life gets a little messy. just want you to know that.",
  },

  {
    id: 2,
    position: "right",
    revealAt: 0.48,

    preview: "this one is a little...",
    title: "something I mean",

    message:
      "I’ll never do anything that makes you question what we have. Whatever comes our way,I’ll always protect what’s ours.",
  },

  {
    id: 3,
    position: "left-bottom",
    revealAt: 0.76,

    preview: "and maybe, just maybe...",
    title: "for all the days ahead",

    message:
      "I’ll always try to make our future brighter.Not a perfect one,just one where we keep choosing each other and keep finding reasons to smile.",
  },
];


/* =========================================================
   COMPONENT
   ========================================================= */

function PoemWorld({
  visible = true,
  onComplete,
}) {

  /* =======================================================
     REFS
     ======================================================= */

  const audioRef = useRef(null);

  const finishTimeoutRef = useRef(null);


  /* =======================================================
     STATE
     ======================================================= */

  /*
   * Opening screen vs actual poem.
   */
  const [started, setStarted] = useState(false);


  /*
   * Whether audio is currently playing.
   */
  const [audioStarted, setAudioStarted] = useState(false);


  /*
   * Whether narration has completely finished.
   */
  const [audioFinished, setAudioFinished] = useState(false);


  /*
   * Actual audio progress from 0 → 100.
   */
  const [progress, setProgress] = useState(0);


  /*
   * Actual current audio time.
   *
   * IMPORTANT:
   * This is STATE, not just audio.currentTime.
   *
   * That means React will re-render when the audio moves
   * and our notes can appear at the correct moment.
   */
  const [currentTime, setCurrentTime] = useState(0);


  /*
   * Total audio duration.
   */
  const [duration, setDuration] = useState(0);


  /*
   * Currently opened note.
   */
  const [activeNote, setActiveNote] = useState(null);


  /*
   * Closing animation.
   */
  const [closing, setClosing] = useState(false);


  /*
   * Audio loading/playback error.
   */
  const [audioError, setAudioError] = useState(false);


  /* =======================================================
     RESET
     ======================================================= */

  useEffect(() => {

    if (!visible) {

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      if (finishTimeoutRef.current) {
        clearTimeout(finishTimeoutRef.current);
        finishTimeoutRef.current = null;
      }

      setStarted(false);
      setAudioStarted(false);
      setAudioFinished(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      setActiveNote(null);
      setClosing(false);
      setAudioError(false);

      return;
    }


    /*
     * Reset whenever this world becomes visible.
     */

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setStarted(false);
    setAudioStarted(false);
    setAudioFinished(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setActiveNote(null);
    setClosing(false);
    setAudioError(false);

  }, [visible]);


  /* =======================================================
     AUDIO METADATA LOADED
     ======================================================= */

  const handleLoadedMetadata = () => {

    const audio = audioRef.current;

    if (!audio) return;

    if (
      Number.isFinite(audio.duration) &&
      audio.duration > 0
    ) {

      setDuration(audio.duration);

      console.log(
        "🎵 Poem duration:",
        audio.duration.toFixed(2),
        "seconds"
      );
    }
  };


  /* =======================================================
     AUDIO TIME UPDATE
     ======================================================= */

  const handleTimeUpdate = () => {

    const audio = audioRef.current;

    if (!audio) return;


    const time = audio.currentTime;

    setCurrentTime(time);


    if (
      Number.isFinite(audio.duration) &&
      audio.duration > 0
    ) {

      setDuration(audio.duration);


      const percentage =
        (time / audio.duration) * 100;


      setProgress(
        Math.min(
          100,
          Math.max(0, percentage)
        )
      );
    }
  };


  /* =======================================================
     START POEM
     ======================================================= */

  const startPoem = async () => {

    /*
     * Prevent double clicking.
     */

    if (started) return;


    const audio = audioRef.current;


    /*
     * IMPORTANT:
     *
     * Start the visual experience immediately.
     *
     * Even if the browser refuses audio playback,
     * the user should NOT be thrown back to the
     * opening screen.
     */

    setStarted(true);
    setAudioError(false);
    setAudioFinished(false);
    setCurrentTime(0);
    setProgress(0);


    /*
     * Safety check.
     */

    if (!audio) {

      console.error(
        "❌ Poem audio element not found."
      );

      setAudioError(true);

      return;
    }


    try {

      /*
       * Reset audio.
       */

      audio.pause();
      audio.currentTime = 0;


      /*
       * Make sure metadata is available.
       */

      if (
        !Number.isFinite(audio.duration) ||
        audio.duration === 0
      ) {

        audio.load();

      }


      /*
       * Start narration.
       *
       * Because this function runs directly from the
       * user's click, browser autoplay restrictions
       * should normally allow this.
       */

      await audio.play();


      setAudioStarted(true);

      console.log(
        "🎵 Poem narration started."
      );

    } catch (error) {

      console.error(
        "❌ Unable to start poem audio:",
        error
      );


      /*
       * VERY IMPORTANT:
       *
       * Do NOT do:
       *
       * setStarted(false)
       *
       * The visual poem must remain open.
       */

      setAudioStarted(false);
      setAudioError(true);

    }

  };


  /* =======================================================
     AUDIO PLAYING
     ======================================================= */

  const handlePlay = () => {

    setAudioStarted(true);
    setAudioError(false);

  };


  /* =======================================================
     AUDIO PAUSED
     ======================================================= */

  const handlePause = () => {

    /*
     * Don't mark it as paused if the narration
     * has already finished.
     */

    if (!audioFinished) {
      setAudioStarted(false);
    }

  };


  /* =======================================================
     AUDIO ERROR
     ======================================================= */

  const handleAudioError = (event) => {

    console.error(
      "❌ Poem audio could not be loaded.",
      event
    );

    setAudioError(true);
    setAudioStarted(false);

  };


  /* =======================================================
     AUDIO FINISHED
     ======================================================= */

  const handleAudioEnded = () => {

    console.log(
      "🎵 Poem narration finished."
    );


    /*
     * Force final progress.
     */

    setCurrentTime(
      audioRef.current?.duration || currentTime
    );

    setProgress(100);


    /*
     * Narration is now finished.
     */

    setAudioStarted(false);
    setAudioFinished(true);


    /*
     * We DO NOT call onComplete here.
     *
     * The user should get a moment to experience
     * the final reveal and open the notes.
     */

  };


  /* =======================================================
     OPEN NOTE
     ======================================================= */

  const openNote = (note) => {

    /*
     * Notes can appear during the poem,
     * but they cannot be opened yet.
     *
     * This prevents interrupting the narration.
     */

    if (!audioFinished) {
      return;
    }


    setActiveNote(note);

  };


  /* =======================================================
     CLOSE NOTE
     ======================================================= */

  const closeNote = () => {

    setActiveNote(null);

  };


  /* =======================================================
     FINISH WORLD
     ======================================================= */

  const finish = () => {

    if (closing) return;


    /*
     * Safety:
     * the poem must have finished first.
     */

    if (!audioFinished) return;


    console.log(
      "🌎 Completing PoemWorld..."
    );


    setClosing(true);


    /*
     * Let the fade-out animation complete.
     */

    finishTimeoutRef.current =
      window.setTimeout(() => {

        console.log(
          "✅ PoemWorld complete."
        );


        if (onComplete) {
          onComplete();
        }

      }, 1100);

  };


  /* =======================================================
     CLEANUP
     ======================================================= */

  useEffect(() => {

    return () => {

      if (finishTimeoutRef.current) {

        clearTimeout(
          finishTimeoutRef.current
        );

        finishTimeoutRef.current = null;
      }


      if (audioRef.current) {

        audioRef.current.pause();

      }

    };

  }, []);


  /* =======================================================
     DON'T RENDER WHEN HIDDEN
     ======================================================= */

  if (!visible) {
    return null;
  }


  /* =======================================================
     CALCULATE NOTE VISIBILITY
     ======================================================= */

  /*
   * Convert current audio time into a 0 → 1 value.
   *
   * Example:
   *
   * audio = 90 sec
   * current = 45 sec
   *
   * progressRatio = 0.50
   */

  const progressRatio =
    duration > 0
      ? currentTime / duration
      : 0;


  /*
   * A note becomes visible once the narration
   * reaches its reveal percentage.
   */

  const visibleNotes = NOTES.filter(
    (note) =>
      started &&
      (
        audioFinished ||
        progressRatio >= note.revealAt
      )
  );


  /* =======================================================
     RENDER
     ======================================================= */

  return (

    <section
      className={`
        poem-world
        ${started ? "is-started" : ""}
        ${audioFinished ? "is-finished" : ""}
        ${closing ? "is-closing" : ""}
      `}
    >

      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        className="pw-background"
        aria-hidden="true"
      >

        <div className="pw-background-image" />

        <div className="pw-background-overlay" />

        <div className="pw-background-vignette" />

      </div>


      {/* =====================================================
          TOP LEFT
          ===================================================== */}

      <div className="pw-top-label">

        <span>
          FOR YOU, ALWAYS.
        </span>

        <b>♡</b>

      </div>


      {/* =====================================================
          TOP RIGHT
          ===================================================== */}

      <div className="pw-music">

        <span>
          ♪
        </span>

        <small>
          HEADPHONES RECOMMENDED
        </small>

      </div>


      {/* =====================================================
          AUDIO

          CURRENT FILE:
          /public/audio/poemBG.mp3

          VITE PUBLIC PATH:
          /audio/poemBG.mp3
          ===================================================== */}

      <audio
        ref={audioRef}
        src="/audio/Poemmg.m4a"
        preload="auto"

        onLoadedMetadata={
          handleLoadedMetadata
        }

        onTimeUpdate={
          handleTimeUpdate
        }

        onPlay={
          handlePlay
        }

        onPause={
          handlePause
        }

        onEnded={
          handleAudioEnded
        }

        onError={
          handleAudioError
        }
      />


      {/* =====================================================
          OPENING SCREEN

          ONLY VISIBLE BEFORE THE POEM STARTS.
          ===================================================== */}

      {!started && (

        <div className="pw-opening">

          <span className="pw-opening-eyebrow">
            THE LAST LITTLE WORLD
          </span>


          <h1>
            just a few things
          </h1>


          <p>
            <em>
              I wanted you to hear.
            </em>
          </p>


          <div className="pw-opening-divider">

            <span />

            <b>
              ♡
            </b>

            <span />

          </div>


          <button
            type="button"
            className="pw-start"
            onClick={startPoem}
          >

            <span>
              stay here for a moment
            </span>

            <b>
              ↓
            </b>

          </button>

        </div>

      )}


      {/* =====================================================
          POEM EXPERIENCE
          ===================================================== */}

      {started && (

        <div className="pw-poem-content">


          {/* =================================================
              POEM HEADING
              ================================================= */}

          <div className="pw-poem-heading">

            <span>
              THE LAST LITTLE WORLD
            </span>


            <h1>
              some things are easier
              <br />
              <em>
                to feel than say.
              </em>
            </h1>

          </div>


          {/* =================================================
              AUDIO ERROR
              ================================================= */}

          {audioError && !audioFinished && (

            <div className="pw-audio-error">

              <span>
                the words are still here...
              </span>

              <small>
                the music couldn't start,
                but you can stay and read.
              </small>

            </div>

          )}


          {/* =================================================
              PROGRESS
              ================================================= */}

          {!audioFinished && !audioError && (

            <div className="pw-progress">

              <div className="pw-progress-track">

                <div
                  className="pw-progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>


              <span>
                listen...
              </span>

            </div>

          )}


          {/* =================================================
              LITTLE NOTES

              THEY APPEAR DURING THE POEM.

              BUT THEY ONLY BECOME CLICKABLE
              AFTER THE POEM HAS FINISHED.
              ================================================= */}

          <div className="pw-notes">

            {visibleNotes.map((note) => (

              <button
                key={note.id}
                type="button"

                className={`
                  pw-note
                  pw-note--${note.position}
                  ${audioFinished ? "is-unlocked" : "is-locked"}
                `}

                onClick={() =>
                  openNote(note)
                }

                disabled={!audioFinished}
              >

                <span className="pw-note-pin">
                  ♡
                </span>


                <span className="pw-note-preview">
                  {note.preview}
                </span>


                <small>

                  {audioFinished
                    ? "open note"
                    : "a little note"}

                </small>

              </button>

            ))}

          </div>


          {/* =================================================
              FINAL REVEAL

              APPEARS ONLY AFTER THE AUDIO FINISHES.
              ================================================= */}

          {audioFinished && (

            <div className="pw-after-poem">

  <span>
    and one last little thing...
  </span>

  <h2>
    This isn't the end.
  </h2>

  <p>
    Some parts of this story are still
    <br />
    waiting to be held.
  </p>

  <div className="pw-after-divider">
    <span />
    <b>♡</b>
    <span />
  </div>

  <div className="pw-backstage-copy">
    <h3>
      A little something I made for you 🤍
    </h3>

    <p>
      There are a few things sitting with me right now
      <br />
      that I couldn't put in your hands today...
      <br />
      so until I can give them to you myself,
      <br />
      here's a tiny glimpse of what's waiting.
    </p>
  </div>

  <button
    type="button"
    className="pw-final-button"
    onClick={finish}
  >
    <span>
      one last little surprise
    </span>

    <b>→</b>
  </button>

</div>

          )}

        </div>

      )}


      {/* =====================================================
          NOTE MODAL
          ===================================================== */}

      {activeNote && (

        <div
          className="pw-note-overlay"
          onClick={closeNote}
        >

          <div
            className="pw-note-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="pw-note-close"
              onClick={closeNote}
              aria-label="Close note"
            >
              ×
            </button>


            <span className="pw-modal-small">
              A LITTLE NOTE
            </span>


            <h2>
              {activeNote.title}
            </h2>


            <div className="pw-modal-divider">

              <span />

              <b>
                ♡
              </b>

              <span />

            </div>


            <p>
              {activeNote.message}
            </p>


            <span className="pw-modal-signature">
              — from me
            </span>

          </div>

        </div>

      )}

    </section>

  );

}


export default PoemWorld;