import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import MapComponent from './components/Map';

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col">
        <nav className="bg-gray-800 p-4 text-white flex gap-4">
          <Link to="/" className="hover:text-gray-300">Map</Link>
          <Link to="/login" className="hover:text-gray-300">Login</Link>
        </nav>
        <div className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MapComponent />} />
            <Route path="/map" element={<MapComponent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
