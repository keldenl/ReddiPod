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
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex justify-center pt-8">
      <div className="max-w-6xl w-full p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 sticky top-4 self-start">
            <img
              src={`${BASE_URL}/subreddit/${subreddit}/cover.png`}
              className="w-full h-auto mb-4 rounded-lg"
            />
            <h1 className="text-3xl font-bold mb-4">{podcastInfo.title}</h1>
            <p className="text-gray-400 mb-8">{podcastInfo.description}</p>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Episodes</h2>
            <div className="space-y-4">
              {podcastInfo.episodes.map((episode) => (
                <Link
                  key={episode}
                  to={`/podcast/${subreddit}/episode/${episode}`}
                  className="flex items-center bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors duration-300"
                >
                  <img
                    src={`${BASE_URL}/subreddit/${subreddit}/cover.png`}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{episode}</h3>
                    <p className="text-gray-400">By ELIZA & KAI</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PodcastDetail;
