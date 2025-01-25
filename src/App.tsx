import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ReportList = lazy(() => import("./pages/ReportList"));

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div className="font-poppins">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={token ? <Navigate to="/dashboard" /> : <Landing />}
            />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
