import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import yaml from "js-yaml";

import { BASE_URL } from "../constants";

function PodcastList() {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    async function fetchPodcasts() {
      try {
        const response = await axios.get(`${BASE_URL}/subreddit-list.yaml`);
        const data = yaml.load(response.data);
        setPodcasts(data.subreddits);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    }

    fetchPodcasts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AutoPodcast</h1>
      <ul>
        {podcasts.map((subreddit) => (
          <li key={subreddit} className="mb-2">
            <Link
              to={`/podcast/${subreddit}`}
              className="text-blue-400 hover:underline"
            >
              {subreddit}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PodcastList;