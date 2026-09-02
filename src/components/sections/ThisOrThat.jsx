import { useEffect, useState } from "react";

import thisOrThatOptions from "../../data/thisOrThatOptions";

import "./ThisOrThat.css";

function ThisOrThat({ visible, onChoice }) {
  const [stage, setStage] = useState("intro");

  const [currentPair, setCurrentPair] = useState(null);

  /*
   * Keep track of the This-or-That pairs
   * that have already been shown.
   */
  const [usedPairs, setUsedPairs] = useState([]);


  /* =========================================
     WHEN THIS OR THAT BECOMES VISIBLE
     ========================================= */

  useEffect(() => {
    if (!visible) {
      setStage("intro");
      setCurrentPair(null);

      return;
    }

    /*
     * Find pairs that haven't been used yet.
     */
    let availablePairs =
      thisOrThatOptions.filter(
        (pair) => !usedPairs.includes(pair.id)
      );


    /*
     * If every pair has been used,
     * start the pool again.
     *
     * This is mainly a safety mechanism.
     */
    if (availablePairs.length === 0) {
      setUsedPairs([]);

      availablePairs = thisOrThatOptions;
    }


    /*
     * Pick a random pair.
     */
    const randomIndex = Math.floor(
      Math.random() * availablePairs.length
    );

    const selectedPair =
      availablePairs[randomIndex];


    setCurrentPair(selectedPair);

    /*
     * Mark this pair as used.
     */
    setUsedPairs((previous) => [
      ...previous,
      selectedPair.id,
    ]);


    /*
     * Show the introduction first.
     */
    setStage("intro");


    /*
     * Then reveal the choices.
     */
    const timer = setTimeout(() => {
      setStage("choice");
    }, 2200);


    return () => {
      clearTimeout(timer);
    };

  }, [visible]);


  /* =========================================
     HANDLE CHOICE
     ========================================= */

  const handleChoice = (choice) => {
    if (stage !== "choice") return;

    /*
     * Show the selected side for a moment.
     */
    setStage(choice);


    /*
     * Then hand control back to Intro.
     *
     * The actual world selection happens
     * separately inside WorldManager.
     */
    setTimeout(() => {

      if (onChoice) {
        onChoice(choice);
      }

    }, 900);
  };


  /* =========================================
     NOT VISIBLE
     ========================================= */

  if (!visible) {
    return null;
  }


  return (
    <section className="this-or-that">


      {/* =====================================
          INTRO
      ===================================== */}

      {stage === "intro" && (
        <div className="this-or-that-intro">

          <p className="tot-eyebrow">
            one little thing before we continue
          </p>

          <h2>
            Let's play our
            <br />
            favourite game.
          </h2>

        </div>
      )}


      {/* =====================================
          CHOICE
      ===================================== */}

      {stage === "choice" &&
        currentPair && (

          <div className="this-or-that-choice">

            <p className="tot-eyebrow">
              you know the rules
            </p>

            <h2 className="tot-title">
              This or That?
            </h2>


            <div className="choice-pair">


              {/* =============================
                  THIS
              ============================= */}

              <button
                className="choice-card choice-this"
                onClick={() =>
                  handleChoice("this")
                }
              >

                <span className="choice-small">
                  THIS
                </span>

                <span className="choice-main">
                  {currentPair.left.emoji}
                </span>

                <span className="choice-label">
                  {currentPair.left.label}
                </span>

              </button>


              {/* =============================
                  OR
              ============================= */}

              <div className="choice-divider">

                <span>
                  or
                </span>

              </div>


              {/* =============================
                  THAT
              ============================= */}

              <button
                className="choice-card choice-that"
                onClick={() =>
                  handleChoice("that")
                }
              >

                <span className="choice-small">
                  THAT
                </span>

                <span className="choice-main">
                  {currentPair.right.emoji}
                </span>

                <span className="choice-label">
                  {currentPair.right.label}
                </span>

              </button>

            </div>

          </div>
        )}


      {/* =====================================
          SELECTED — THIS
      ===================================== */}

      {stage === "this" && (

        <div
          className="
            choice-selected
            choice-selected-this
          "
        >

          <span>
            this.
          </span>

        </div>

      )}


      {/* =====================================
          SELECTED — THAT
      ===================================== */}

      {stage === "that" && (

        <div
          className="
            choice-selected
            choice-selected-that
          "
        >

          <span>
            that.
          </span>

        </div>

      )}

    </section>
  );
}

export default ThisOrThat;