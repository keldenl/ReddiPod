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
    <div className="bg-black text-white min-h-screen px-4">
      <input
        type="text"
        placeholder="Search shows..."
        className="px-4 py-2 w-full rounded-full bg-gray-800 text-white focus:outline-none"
      />

      {/* <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Popular Today</h2>
        <div className="grid grid-cols-3 gap-4">
          {podcasts.slice(0, 3).map((subreddit) => (
            <Link
              key={subreddit}
              to={`/podcast/${subreddit}`}
              className="relative rounded-lg overflow-hidden" // Added relative for overlay
            >
              <img
                src={`${BASE_URL}/subreddit/${subreddit}/cover.png`}
                alt={subreddit}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                <h3 className="text-lg font-bold">{subreddit}</h3>
                <p className="text-gray-400">Discover 71 songs</p>
              </div>
            </Link>
          ))}
        </div>
      </div> */}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Subreddits</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {podcasts.map((subreddit) => (
            <Link
              key={subreddit}
              to={`/podcast/${subreddit}`}
              className="bg-gray-900 rounded-lg overflow-hidden"
            >
              <img
                src={`${BASE_URL}/subreddit/${subreddit}/cover.png`}
                alt={subreddit}
                className="w-full aspect-square object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-bold">{subreddit}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PodcastList;
