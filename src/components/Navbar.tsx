import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { UserData } from '../models/UserData';

interface NavbarProps {
  userData: UserData | null;
  dropdownOpen: boolean;
  toggleDropdown: () => void;
  handleLogout: () => void;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const Navbar: React.FC<NavbarProps> = ({
  userData,
  dropdownOpen,
  toggleDropdown,
  handleLogout,
  isDrawerOpen,
  toggleDrawer,
  dropdownRef,
}) => {
  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center md:hidden">
            <button onClick={toggleDrawer} className="text-gray-500 focus:outline-none">
              {isDrawerOpen ? <FaTimes size={24} /> : <FaBars size={24} />} {/* Toggle between FaBars and FaTimes */}
            </button>
          </div>
          <div className="flex-1 flex justify-end items-center relative" ref={dropdownRef}>
            {userData && (
              <>
                {/* Profile Section */}
                <div className="flex items-center space-x-4 cursor-pointer" onClick={toggleDropdown}>
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div> {/* Placeholder for profile picture */}
                  <span className="font-medium w-32 truncate hidden md:block">{userData.name}</span> {/* Hide name on mobile */}
                </div>

                {/* Dropdown Menu */}
                <div
                  className={`absolute top-14 right-0 w-56 bg-white border border-gray-200 rounded-md shadow-lg transition-transform duration-300 ${
                    dropdownOpen ? 'scale-100' : 'scale-0'
                  } origin-top-right`}
                >
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Account</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                    <li className="border-t border-gray-200"></li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500" onClick={handleLogout}>
                      Logout
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
