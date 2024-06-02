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
        playEpisode({
          title: data.title,
          url: `${BASE_URL}/subreddit/${subreddit}/${episodeId}.m4a`,
          image: `${BASE_URL}/subreddit/${subreddit}/cover.png`,
          podcastName: `r/${subreddit}`,
        });

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
  }, [subreddit, episodeId, playEpisode, loadedSubEp]);

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
          <p className="text-gray-400 mb-4">By KAI & ELIZA</p>
          <div className="mb-4">
            <p className="text-gray-400">{episodeInfo.description}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Transcript:</h2>
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
