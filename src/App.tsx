import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingOverlay from "./components/LoadingOverlay";
import Notification from "./components/Notification";
import NotFound from "./pages/NotFound";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
import Signature from "./pages/CreateSignature";
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ToDo = lazy(() => import("./pages/ToDo"));
const Report = lazy(() => import("./pages/Report"));
const ReportList = lazy(() => import("./pages/ReportList"));
const EngineerList = lazy(() => import("./pages/EngineerList"));
const CustomerList = lazy(() => import("./pages/CustomerList"));
const ProductList = lazy(() => import("./pages/ProductList"));
const RescheduleRequest = lazy(() => import("./pages/RescheduleRequest"));

function App() {
  const token = localStorage.getItem("token");
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "error"
  );

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  useEffect(() => {
    const handleShowNotification = (event: Event) => {
      const customEvent = event as CustomEvent;
      showNotification(customEvent.detail.message, customEvent.detail.type);
    };

    window.addEventListener(
      "showNotification",
      handleShowNotification as EventListener
    );

    return () => {
      window.removeEventListener("showNotification", handleShowNotification);
    };
  }, []);

  return (
    <Router>
      <div className="font-poppins">
        {notification && (
          <Notification
            message={notification}
            type={notificationType}
            onClose={() => setNotification("")}
          />
        )}
        <Suspense fallback={<LoadingOverlay />}>
          <Routes>
            <Route
              path="/login"
              element={<Login showNotification={showNotification} />}
            />
            <Route
              path="/register"
              element={<Register showNotification={showNotification} />}
            />
            <Route
              path="/signature"
              element={
                <ProtectedRoute>
                  <Signature />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/todo"
              element={
                <ProtectedRoute>
                  <ToDo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/todo/report"
              element={
                <ProtectedRoute>
                  <Report />
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
              path="/engineers"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
                  <EngineerList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
                  <CustomerList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
                  <ProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reschedule"
              element={
                <ProtectedRoute>
                  <RescheduleRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={token ? <Navigate to="/dashboard" /> : <Landing />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
