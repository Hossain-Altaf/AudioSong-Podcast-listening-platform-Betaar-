import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import PlayerBar from './components/PlayerBar';
import ArtistDashboard from './pages/ArtistDashboard';
import Playlists from './pages/Playlists';
import Podcasts from './pages/Podcasts';
import PodcastDetail from './pages/PodcastDetail';
import Downloads from './pages/Downloads';
import Audiobooks from './pages/Audiobooks';
import AudiobookDetail from './pages/AudiobookDetail';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/podcasts/:id" element={<PodcastDetail />} />
        <Route path="/audiobooks" element={<Audiobooks />} />
        <Route path="/audiobooks/:id" element={<AudiobookDetail />} />
        <Route
          path="/artist/dashboard"
          element={
            <ProtectedRoute allowedRole="artist">
              <ArtistDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <Playlists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/downloads"
          element={
            <ProtectedRoute>
              <Downloads />
            </ProtectedRoute>
          }
        />
      </Routes>

      <PlayerBar />
    </>
  );
}

export default App;