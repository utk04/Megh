import { useState } from "react";

import MagicWorld from "../worlds/magicworld/MagicWorld";
import SunflowerWorld from "../worlds/sunflower/SunflowerWorld";
import ConstellationWorld from "../worlds/constellation/ConstellationWorld";
import PoemWorld from "../worlds/PoemWorld/PoemWorld";

import "./WorldManager.css";


// ============================================================
// WORLD ORDER
// ============================================================

const WORLD_SEQUENCE = [
  {
    id: "magic",
    component: MagicWorld,
  },
  {
    id: "sunflower",
    component: SunflowerWorld,
  },
  {
    id: "constellation",
    component: ConstellationWorld,
  },
  {
    id: "poem",
    component: PoemWorld,
  },
];


// ============================================================
// GIFTS / BACKSTAGE
// ============================================================

const GIFTS = [
  {
    id: 1,
    image: "/gifts/gift1.jpg",
    title: "A little something...",
    text: "Waiting patiently to find its way into your hands.",
  },
  {
    id: 2,
    image: "/gifts/gift2.jpg",
    title: "Another tiny surprise",
    text: "This one is still with me for now.",
  },
  {
    id: 3,
    image: "/gifts/gift3.jpg",
    title: "And one more...",
    text: "Some surprises are better when they arrive in person.",
  },
];


// ============================================================
// WORLD MANAGER
// ============================================================

function WorldManager({
  visible,
  onWorldComplete,
}) {
  const [
    currentWorldIndex,
    setCurrentWorldIndex,
  ] = useState(0);

  const [
    transitioning,
    setTransitioning,
  ] = useState(false);

  const [
    experienceComplete,
    setExperienceComplete,
  ] = useState(false);


  // ==========================================================
  // HIDDEN
  // ==========================================================

  if (!visible) {
    return null;
  }


  // ==========================================================
  // FINAL BACKSTAGE / ENDING SCREEN
  // ==========================================================

  if (experienceComplete) {
    return (
      <main className="world-manager world-manager--complete">

        <div className="world-manager__stage">

          <section className="world-manager__ending">

            {/* Soft background decoration */}
            <div className="ending-glow ending-glow--one" />
            <div className="ending-glow ending-glow--two" />

            <div className="ending-stars ending-stars--top">
              ✦　⋆　✧　⋆　✦　⋆　✧
            </div>


            {/* MAIN MESSAGE */}

            <div className="ending-message">

              <p className="ending-small-line">
                And one last little thing...
              </p>

              <h1>
                This isn't the end.
              </h1>

              <p className="ending-quote">
                Some parts of this story are still
                <br />
                waiting to be held.
              </p>

              <div className="ending-divider">
                <span>♡</span>
              </div>

              <p className="ending-bts-title">
                A little backstage peek 👀
              </p>

              <p className="ending-bts-text">
                There are a few surprises with me that
                <br />
                I couldn't give you today...
                <br />
                so until I can put them in your hands,
                <br />
                here's a tiny glimpse of what's waiting.
              </p>

            </div>


            {/* GIFT CARDS */}

            <div className="ending-gifts">

              {GIFTS.map((gift, index) => (
                <div
                  className="ending-gift"
                  key={gift.id}
                  style={{
                    "--gift-delay": `${index * 0.15}s`,
                  }}
                >

                  <div className="ending-gift-tape">
                    <span />
                  </div>

                  <div className="ending-gift-image-wrap">

                    <img
                      src={gift.image}
                      alt={gift.title}
                      className="ending-gift-image"
                      draggable="false"
                    />

                  </div>

                  <div className="ending-gift-info">

                    <h3>
                      {gift.title}
                    </h3>

                    <p>
                      {gift.text}
                    </p>

                  </div>

                </div>
              ))}

            </div>


            <div className="ending-final-line">
              <span>Until then...</span>
              <strong>keep this little piece of today with you. ♡</strong>
            </div>


            <div className="ending-stars ending-stars--bottom">
              ✧　⋆　✦　⋆　✧　⋆　✦
            </div>

          </section>

        </div>

      </main>
    );
  }


  // ==========================================================
  // CURRENT WORLD
  // ==========================================================

  const CurrentWorld =
    WORLD_SEQUENCE[currentWorldIndex]?.component;

  if (!CurrentWorld) {
    return null;
  }


  // ==========================================================
  // WORLD COMPLETE
  // ==========================================================

  const handleWorldComplete = () => {

    // Prevent double completion
    if (transitioning) {
      return;
    }

    const completedWorld =
      WORLD_SEQUENCE[currentWorldIndex];

    const isLastWorld =
      currentWorldIndex ===
      WORLD_SEQUENCE.length - 1;


    console.log(
      "🌎 World completed:",
      completedWorld.id
    );


    // ========================================================
    // FINAL WORLD — POEM
    // ========================================================

    if (isLastWorld) {

      setTransitioning(true);

      window.setTimeout(() => {

        // IMPORTANT:
        // We end the experience HERE.
        //
        // We do NOT call onWorldComplete.
        // This prevents Intro from opening another
        // This-or-That and starting the loop again.

        setExperienceComplete(true);

        setTransitioning(false);

      }, 900);

      return;
    }


    // ========================================================
    // NEXT WORLD
    // ========================================================

    setTransitioning(true);

    window.setTimeout(() => {

      setCurrentWorldIndex(
        (previousIndex) =>
          previousIndex + 1
      );

      setTransitioning(false);

      if (onWorldComplete) {
        onWorldComplete(completedWorld);
      }

    }, 700);
  };


  // ==========================================================
  // RENDER CURRENT WORLD
  // ==========================================================

  return (
    <main
      className={`world-manager ${
        transitioning
          ? "world-manager--transitioning"
          : ""
      }`}
    >

      <div className="world-manager__stage">

        <section className="world-manager__world">

          <CurrentWorld
            visible={true}
            onComplete={handleWorldComplete}
          />

        </section>

      </div>

    </main>
  );
}


export default WorldManager;