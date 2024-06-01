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
        if (
          loadedSubEp != null &&
          loadedSubEp === `${subreddit}-${episodeId}`
        ) {
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/subreddit/${subreddit}/${episodeId}.yaml`
        );
        const data = yaml.load(response.data);
        setEpisodeInfo(data);
        setLoadedSubEp(`${subreddit}-${episodeId}`);
        playEpisode({
          title: data.title,
          url: `${BASE_URL}/subreddit/${subreddit}/${subreddit}-${episodeId}.m4a`,
        });

        // Fetch transcript
        const transcriptResponse = await axios.get(
          `${BASE_URL}/subreddit/${subreddit}/${subreddit}-${episodeId}.txt`
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{episodeInfo.title}</h1>
      <p className="mt-4">{episodeInfo.description}</p>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Transcript:</h2>
        <pre className="whitespace-pre-wrap">{transcript}</pre>
      </div>
    </div>
  );
}

export default PodcastPlayer;
