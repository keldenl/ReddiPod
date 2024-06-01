import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import yaml from "js-yaml";

import { BASE_URL } from "../constants";

function PodcastPlayer() {
  const { subreddit, episodeId } = useParams();
  const [episodeInfo, setEpisodeInfo] = useState(null);

  useEffect(() => {
    async function fetchEpisodeInfo() {
      try {
        const response = await axios.get(
          `${BASE_URL}/subreddit/${subreddit}/${episodeId}.yaml`
        );
        const data = yaml.load(response.data);
        setEpisodeInfo(data);
      } catch (error) {
        console.error("Error fetching episode info:", error);
      }
    }

    fetchEpisodeInfo();
  }, [subreddit, episodeId]);

  if (!episodeInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{episodeInfo.title}</h1>
      <ReactPlayer
        url={`${BASE_URL}/subreddit/${subreddit}/${subreddit}-${episodeId}.m4a`}
        // url={`${BASE_URL}/subreddit/${subreddit}/${subreddit}-202405020104.m4a`}
        controls
        width="100%"
        height="50px"
      />
      <p className="mt-4">{episodeInfo.description}</p>
    </div>
  );
}

export default PodcastPlayer