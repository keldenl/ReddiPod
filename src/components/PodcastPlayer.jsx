import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import yaml from "js-yaml";

import { BASE_URL } from "../constants";

function PodcastPlayer() {
  const { subreddit } = useParams();
  const [podcastInfo, setPodcastInfo] = useState(null);

  useEffect(() => {
    async function fetchPodcastInfo() {
      try {
        const response = await axios.get(
          `${BASE_URL}/subreddit/${subreddit}/info.yaml`
        );
        const data = yaml.load(response.data);
        setPodcastInfo(data);
      } catch (error) {
        console.error("Error fetching podcast info:", error);
      }
    }

    fetchPodcastInfo();
  }, [subreddit]);

  if (!podcastInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{podcastInfo.title}</h1>
      <ReactPlayer
        url={`${BASE_URL}/subreddit/${subreddit}/202405020104.m4a`}
        controls
        width="100%"
        height="50px"
      />
      <p className="mt-4">{podcastInfo.description}</p>
    </div>
  );
}

export default PodcastPlayer;
