import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import yaml from "js-yaml";

import { BASE_URL } from "../constants";

function PodcastDetail() {
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
      <ul>
        {podcastInfo.episodes.map((episode) => (
          <li key={episode} className="mb-2">
            <Link
              to={`/podcast/${subreddit}/episode/${episode}`}
              className="text-blue-400 hover:underline"
            >
              {episode}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PodcastDetail;
