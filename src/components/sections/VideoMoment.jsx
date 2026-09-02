import { useEffect, useRef } from "react";

import videoFile from "../../assets/videos/video1.mp4";

import "./VideoMoment.css";

function VideoMoment({ visible, onComplete }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!visible || !videoRef.current) return;

    const video = videoRef.current;

    video.currentTime = 0;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.error("Video could not start:", error);
      }
    };

    playVideo();

    return () => {
      video.pause();
    };
  }, [visible]);

  const handleVideoEnded = () => {
    console.log("🎬 Video finished");

    if (onComplete) {
      onComplete();
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <section className="video-moment video-moment-visible">

      <div className="video-moment-background" />

      <div className="video-moment-content">

        <div className="video-frame">

          <video
            ref={videoRef}
            src={videoFile}
            className="birthday-video"
            playsInline
            controls={false}
            onEnded={handleVideoEnded}
          />

        </div>

        <div className="video-caption">
          just hear me out...
        </div>

      </div>

    </section>
  );
}

export default VideoMoment;