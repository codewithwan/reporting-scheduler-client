import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { fetchUserProfile } from "../services/api";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userData, setUserData] = useState<{ name: string } | null>(null);

  const location = useLocation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetchUserProfile();
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    loadUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-poppins flex">
      <Sidebar isDrawerOpen={isDrawerOpen} selectedMenu={location.pathname} />
      <div className="flex-1 lg:ml-64">
        <Navbar
          toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
          isDrawerOpen={isDrawerOpen}
          userData={userData}
          handleLogout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />
        <main className="pb-10">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
