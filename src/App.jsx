import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PodcastList from "./components/PodcastList";
import PodcastDetail from "./components/PodcastDetail";
import PodcastPlayer from "./components/PodcastPlayer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PodcastList />} />
        <Route path="/podcast/:subreddit" element={<PodcastDetail />} />
        <Route path="/podcast/:subreddit/episode/:episodeId" element={<PodcastPlayer />} />
      </Routes>
    </Router>
  );
}

export default App;