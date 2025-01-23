import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

interface NavbarProps {
  toggleDrawer: () => void;
  isDrawerOpen: boolean;
  userData: { name: string } | null;
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  toggleDrawer,
  isDrawerOpen,
  userData,
  handleLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md fixed w-full z-30">
      <div className="max-w-7xl sm:px-10 px-4 flex sm:justify-end justify-between h-16">
        <button onClick={toggleDrawer} className="text-gray-500 md:hidden">
          {isDrawerOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        {userData && (
          <div
            className="relative flex items-center space-x-4 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <span className="font-medium truncate hidden md:block">
              {userData.name}
            </span>
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-40"
              >
                <button
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
