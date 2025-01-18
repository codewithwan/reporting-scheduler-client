import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ReportList from './pages/ReportList';
import Users from './pages/Users';
import Layout from './components/Layout'; // Import Layout component

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
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report-list" element={<ReportList />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
