
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Submit from './pages/Submit';
import LiveFeed from './pages/LiveFeed';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="submit" element={<Submit />} />
          <Route path="live-feed" element={<LiveFeed />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
