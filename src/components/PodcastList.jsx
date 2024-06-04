import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import yaml from "js-yaml";
import { formatDistanceToNowStrict, parseISO } from "date-fns"; // Import date-fns for formatting

import { BASE_URL } from "../constants";

function PodcastList() {
  const [podcasts, setPodcasts] = useState([]);
  const [recentPodcasts, setRecentPodcasts] = useState([]);

  useEffect(() => {
    async function fetchPodcasts() {
      try {
        const response = await axios.get(`${BASE_URL}/subreddit-list.yaml`);
        const subreddits = yaml.load(response.data).subreddits;

        const podcastPromises = subreddits.map(async (subreddit) => {
          const response = await axios.get(
            `${BASE_URL}/subreddit/${subreddit}/info.yaml`
          );
          const data = yaml.load(response.data);

          return {
            subreddit,
            title: data.title,
            description: data.description,
            episodes: data.episodes || [], // Ensure episodes is an array
            lastUpdated: data.episodes ? data.episodes[0] : null, // Handle case with no episodes
          };
        });

        const fetchedPodcasts = await Promise.all(podcastPromises);

        setPodcasts(fetchedPodcasts);

        // Sort podcasts by last updated date, placing those without episodes at the end
        const sortedPodcasts = fetchedPodcasts
          .filter((podcast) => podcast.lastUpdated) // Only include those with a lastUpdated date
          .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
        setRecentPodcasts(sortedPodcasts.slice(0, 3)); // Get the latest 3 podcasts
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    }

    fetchPodcasts();
  }, []);

  const formatDate = (timestamp) => {
    return formatDistanceToNowStrict(
      parseISO(
        `${timestamp.substring(0, 4)}-${timestamp.substring(
          4,
          6
        )}-${timestamp.substring(6, 8)}T${timestamp.substring(
          8,
          10
        )}:${timestamp.substring(10, 12)}`
      ),
      { addSuffix: true }
    )
      .replace(" hour", "hr")
      .replace(" hours", "hrs")
      .replace(" minute", "min")
      .replace(" minutes", "mins");
  };

  return (
    <div className="bg-black text-white min-h-screen px-4">
      <input
        type="text"
        placeholder="Search shows..."
        className="px-4 py-2 w-full rounded-full bg-gray-800 text-white focus:outline-none"
      />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recently Updated</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentPodcasts.map((podcast) => (
            <Link
              key={podcast.subreddit}
              to={`/r/${podcast.subreddit}`}
              className="bg-gray-900 rounded-lg overflow-hidden"
            >
              <img
                src={`${BASE_URL}/subreddit/${podcast.subreddit}/cover.png`}
                alt={podcast.subreddit}
                className="w-full aspect-square object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-bold">{podcast.title}</h3>
                <p className="text-gray-400 text-xs">
                  {podcast.episodes.length} episodes • Updated{" "}
                  {formatDate(podcast.lastUpdated)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Subreddits</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {podcasts.map((podcast) => (
            <Link
              key={podcast.subreddit}
              to={`/r/${podcast.subreddit}`}
              className="bg-gray-900 rounded-lg overflow-hidden"
            >
              <img
                src={`${BASE_URL}/subreddit/${podcast.subreddit}/cover.png`}
                alt={podcast.subreddit}
                className="w-full aspect-square object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-bold">{podcast.title}</h3>
                <p className="text-gray-400 text-xs">
                  {podcast.episodes.length} episodes{" "}
                  {podcast.lastUpdated &&
                    `• Updated ${formatDate(podcast.lastUpdated)}`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PodcastList;
