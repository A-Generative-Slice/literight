import { useRef, useEffect } from 'react';

/**
 * A secure-ready video player component that tracks progress.
 * Designed to be compatible with VdoCipher, Azure, or standard MP4s.
 */
const SecurePlayer = ({ url, lessonId, onProgressUpdate, startTime = 0 }) => {
  const videoRef = useRef(null);
  const lastSavedTime = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video && startTime > 0) {
      video.currentTime = startTime;
    }
  }, [startTime]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = Math.floor(video.currentTime);
    
    // Save progress every 5 seconds to reduce API load
    if (currentTime % 5 === 0 && currentTime !== lastSavedTime.current) {
      lastSavedTime.current = currentTime;
      onProgressUpdate(lessonId, currentTime);
    }
  };

  const handleEnded = () => {
    onProgressUpdate(lessonId, videoRef.current.duration, true);
  };

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl group border border-border">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        controlsList="nodownload" // Basic protection
        onContextMenu={(e) => e.preventDefault()} // Disable right-click
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Premium Overlay (Can be used for Watermarking etc.) */}
      <div className="absolute top-4 right-4 pointer-events-none opacity-20 select-none">
        <span className="title-font text-xs text-white font-bold tracking-widest">
          LITERIGHT ACADEMY SECURE STREAM
        </span>
      </div>
    </div>
  );
};

export default SecurePlayer;
