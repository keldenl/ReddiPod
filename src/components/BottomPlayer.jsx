import { useContext, useState, useRef, useEffect } from "react";
import PlayerContext from "../context/PlayerContext";
import { FaPlay, FaPause } from "react-icons/fa";

function BottomPlayer() {
  const { currentEpisode } = useContext(PlayerContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setIsPlaying(!audioRef.current.paused);
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  useEffect(() => {
    const currentAudio = audioRef.current;
    if (currentAudio) {
      currentAudio.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        currentAudio.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [currentEpisode]);

  useEffect(() => {
    // Sync play/pause state with audio element ONLY when:
    // - isPlaying state changes
    // - currentEpisode is not null (audio element should be loaded)
    if (currentEpisode && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentEpisode]);

  // Automatically play the episode when the currentEpisode changes
  useEffect(() => {
    if (currentEpisode && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentEpisode]);

  if (!currentEpisode) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-0 right-0  px-4 z-20">
      <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden bg-white/10 backdrop-blur-md shadow-lg">
        <div className="flex items-center px-4 py-2">
          <img
            src={currentEpisode.image}
            alt={currentEpisode.title}
            className="w-16 h-16 object-cover mr-4 rounded-md"
            style={{
              backdropFilter: "blur(5px)",
            }}
          />
          <div className="flex-1">
            <h3 className="text-white text-lg font-medium">
              {currentEpisode.title}
            </h3>
            <p className="text-gray-400 text-sm">
              {currentEpisode.podcastName}
            </p>
          </div>
          <button onClick={handlePlayPause} className="p-2">
            {isPlaying ? (
              <FaPause className="text-white w-6 h-6" />
            ) : (
              <FaPlay className="text-white w-6 h-6" />
            )}
          </button>
        </div>
        <div className="px-4 pb-2">
          <div className="w-full h-2 rounded-full bg-gray-600 relative">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-blue-500"
              style={{
                width: `${
                  (currentTime / audioRef.current?.duration) * 100 || 0
                }%`,
              }}
            ></div>
            <input
              type="range"
              min="0"
              max={audioRef.current?.duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="absolute top-0 left-0 w-full h-full opacity-0"
            />
          </div>
        </div>
        <audio
          src={currentEpisode.url}
          ref={audioRef}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}

export default BottomPlayer;
