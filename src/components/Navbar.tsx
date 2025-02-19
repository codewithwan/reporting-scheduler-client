
import React, { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { fetchUserProfile } from "../services/api";

interface NavbarProps {
  toggleDrawer: () => void;
  isDrawerOpen: boolean;
  userData: {
    name: string;
    email: string;
  } | null;
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  toggleDrawer,
  isDrawerOpen,
  userData,
  handleLogout,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const response = await fetchUserProfile();
        setSignature(response.data.signature);
      } catch (error) {
        console.error("Gagal mengambil tanda tangan:", error);
      }
    };

    fetchSignature();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md fixed w-full z-30">
      <div className="max-w-7xl md:max-w-[80%] sm:px-10 px-4 flex justify-between h-16">
        <button onClick={toggleDrawer} className="text-gray-500 lg:hidden">
          {isDrawerOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <div className="flex-grow"></div>
        {userData && (
          <div
            className="relative flex items-center space-x-4 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src="https://th.bing.com/th/id/OIP.JeF0IgYcAWCflN4uNXiMigAAAA?rs=1&pid=ImgDetMain"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium truncate hidden md:block">
              {userData.name}
            </span>
          </div>
        )}
      </div>
      {isModalOpen && userData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96" ref={modalRef}>
            <div className="flex flex-col items-center">
              <img
                src="https://th.bing.com/th/id/OIP.JeF0IgYcAWCflN4uNXiMigAAAA?rs=1&pid=ImgDetMain"
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold mb-2">{userData.name}</h2>
              <div className="w-full">
                <div className="flex items-center mb-2">
                  <FaEnvelope className="text-gray-500 mr-2" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaPhone className="text-gray-500 mr-2" />
                  <span>081882870773</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaMapMarkerAlt className="text-gray-500 mr-2" />
                  <span>Jl. Juana raya</span>
                </div>
              </div>
              {signature ? (
                <img
                  src={signature}
                  alt="Signature"
                  className="mt-4 border p-2 max-h-[200px]"
                />
              ) : (
                <p className="mt-4 text-gray-500">Belum ada tanda tangan</p>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 hover:text-white"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
