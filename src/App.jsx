import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PodcastList from "./components/PodcastList";
import PodcastDetail from "./components/PodcastDetail";
import PodcastPlayer from "./components/PodcastPlayer";
import BottomPlayer from "./components/BottomPlayer";
import Navbar from "./components/Navbar";
import { PlayerProvider } from "./context/PlayerContext";

function App() {
  return (
    <PlayerProvider>
      <Router basename="ReddiPod">
        <div className="flex flex-col min-h-screen bg-black text-white">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="" element={<PodcastList />} />
              <Route path="/r/:subreddit" element={<PodcastDetail />} />
              <Route
                path="/r/:subreddit/episode/:episodeId"
                element={<PodcastPlayer />}
              />
            </Routes>
          </div>
          <BottomPlayer />
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;
