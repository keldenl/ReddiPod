import { useContext } from "react";
import ReactPlayer from "react-player";
import PlayerContext from "../context/PlayerContext";

function BottomPlayer() {
  const { currentEpisode } = useContext(PlayerContext);

  if (!currentEpisode) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
      <div className="container mx-auto">
        <h3 className="text-white text-lg">{currentEpisode.title}</h3>
        <ReactPlayer
          url={currentEpisode.url}
          controls
          width="100%"
          height="50px"
        />
      </div>
    </div>
  );
}

export default BottomPlayer;
