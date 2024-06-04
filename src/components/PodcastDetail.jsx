import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import yaml from "js-yaml";
import { formatDistanceToNowStrict, parseISO } from "date-fns"; // Import date-fns for formatting

import { BASE_URL } from "../constants";

function PodcastDetail() {
  const { subreddit } = useParams();
  const [podcastInfo, setPodcastInfo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPodcastInfo() {
      try {
        const response = await axios.get(
          `${BASE_URL}/subreddit/${subreddit}/info.yaml`
        );
        const data = yaml.load(response.data);
        setPodcastInfo(data);

        const episodePromises = data.episodes.map(async (episode) => {
          const episodeResponse = await axios.get(
            `${BASE_URL}/subreddit/${subreddit}/${episode}.yaml`
          );
          const episodeData = yaml.load(episodeResponse.data);
          return { ...episodeData, date: episode };
        });

        const episodesData = await Promise.all(episodePromises);
        setEpisodes(episodesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching podcast info:", error);
        setLoading(false);
      }
    }

    fetchPodcastInfo();
  }, [subreddit]);

  if (!podcastInfo) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">{loading ? 'Loading...' : 'Podcast does not exist... yet!'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex justify-center">
      <div className="max-w-6xl w-full p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 md:sticky top-4 self-start">
            <img
              src={`${BASE_URL}/subreddit/${subreddit}/cover.png`}
              className="w-full h-auto mb-4 rounded-lg"
            />
            <h1 className="text-3xl font-bold mb-4">{podcastInfo.title}</h1>
            <p className="text-gray-400">{podcastInfo.description}</p>
          </div>
          <div className="md:col-span-2 bg-black z-10">
            <h2 className="text-xl font-bold mb-4">Episodes</h2>
            <div className="space-y-4">
              {episodes.map((episode) => (
                <Link
                  key={episode.date}
                  to={`/r/${subreddit}/episode/${episode.date}`}
                  className="flex items-center bg-gray-900/85 rounded-lg p-4 hover:bg-gray-900 transition-colors duration-300"
                >
                  {/* <img
                    src={`${BASE_URL}/subreddit/${subreddit}/cover.png`}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  /> */}
                  <div>
                    <p className="text-gray-500 uppercase text-xs font-bold">
                      {formatDistanceToNowStrict(
                        parseISO(
                          `${episode.date.substring(
                            0,
                            4
                          )}-${episode.date.substring(
                            4,
                            6
                          )}-${episode.date.substring(
                            6,
                            8
                          )}T${episode.date.substring(
                            8,
                            10
                          )}:${episode.date.substring(10, 12)}`
                        ),
                        { addSuffix: true }
                      )
                        .replace(" hour", "hr")
                        .replace(" hours", "hrs")
                        .replace(" minute", "min")
                        .replace(" minutes", "mins")}
                    </p>
                    <h3 className="text-lg font-bold">{episode.title}</h3>
                    <p className="text-gray-400">
                      {episode.description.length > 140
                        ? `${episode.description.substring(0, 140)}...`
                        : episode.description}
                    </p>
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
