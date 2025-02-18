import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../services/api";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetchUserProfile();
        if (response.data.role) {
          setUserRole(response.data.role);
        } else {
          localStorage.removeItem("token"); // Hapus token jika tidak valid
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        localStorage.removeItem("token"); // Hapus token jika error
      } finally {
        setIsLoading(false);
      }
    };
    fetchRole();
  }, [token]);

  if (!token) return <Navigate to="/login" />; // Redirect ke login jika token tidak ada
  if (isLoading) return <div>Loading...</div>; // Tampilkan loading saat mengecek token
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />; // Redirect jika tidak punya akses
  }

  return children;
};

export default ProtectedRoute;
