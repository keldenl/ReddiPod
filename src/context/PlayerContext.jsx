import { createContext, useState } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState(null);

  const playEpisode = (episode) => {
    setCurrentEpisode(episode);
  };

  return (
    <PlayerContext.Provider value={{ currentEpisode, playEpisode }}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContext;
