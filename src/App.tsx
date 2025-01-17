import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Component: App
function App() {
  const token = localStorage.getItem('token');

  // JSX
  return (
    <Router>
      <div className="font-poppins">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Landing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
