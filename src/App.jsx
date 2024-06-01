import PodcastPlayer from './components/PodcastPlayer';
import PodcastList from './components/PodcastList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App bg-gray-900 min-h-screen text-white">
        <Routes>
          <Route path="/" element={<PodcastList />} />
          <Route path="/podcast/:subreddit" element={<PodcastPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;