import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import yaml from "js-yaml";
import PlayerContext from "../context/PlayerContext";

import { BASE_URL } from "../constants";

function PodcastPlayer() {
  const { subreddit, episodeId } = useParams();
  const [loadedSubEp, setLoadedSubEp] = useState(null);
  const [episodeInfo, setEpisodeInfo] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const { playEpisode } = useContext(PlayerContext);

  useEffect(() => {
    async function fetchEpisodeInfo() {
      try {
        if (loadedSubEp != null && loadedSubEp === `${episodeId}`) {
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/subreddit/${subreddit}/${episodeId}.yaml`
        );
        const data = yaml.load(response.data);
        setEpisodeInfo(data);
        setLoadedSubEp(`${episodeId}`);

        // Fetch transcript
        const transcriptResponse = await axios.get(
          `${BASE_URL}/subreddit/${subreddit}/${episodeId}.txt`
        );
        setTranscript(transcriptResponse.data);
      } catch (error) {
        console.error("Error fetching episode info:", error);
      }
    }

    fetchEpisodeInfo();
  }, [subreddit, episodeId, loadedSubEp]);

  const handlePlayEpisode = () => {
    if (episodeInfo) {
      playEpisode({
        episodeInfo,
        episodeId,
        subreddit,
      });
    }
  };

  if (!episodeInfo || !transcript) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <img
          src={`${BASE_URL}/subreddit/${subreddit}/cover.png`}
          alt={episodeInfo.title}
          className="w-full h-auto mb-4 rounded-lg"
        />
        <div className="px-4">
          <h1 className="text-2xl font-bold mb-2">{episodeInfo.title}</h1>
          <p className="text-gray-400 mb-4">By Kelden</p>
          <button
            onClick={handlePlayEpisode}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full mb-4"
          >
            Play Episode
          </button>
          <div className="mb-4">
            <p className="text-gray-400">{episodeInfo.description}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-md font-bold mb-2">Reddit Posts</h2>
            {episodeInfo.links && episodeInfo.links.length > 0 && (
              <ul className="list-decimal list-inside">
                {episodeInfo.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={`https://www.reddit.com${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline break-all"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-8 mb-4">
            <h2 className="text-xl font-bold mb-2">Transcript</h2>
            <pre className="whitespace-pre-wrap text-gray-400">
              {transcript}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PodcastPlayer;
