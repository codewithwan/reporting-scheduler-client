import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../services/api';
import { FaHome, FaCalendarAlt, FaBars } from 'react-icons/fa';
import { UserData } from '../models/UserData'; // Import UserData model

// Component: Dashboard
const Dashboard = () => {
  // State Hooks
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Effects
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetchUserProfile();
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-poppins flex">
      {/* Sidebar */}
      <nav className={`bg-white shadow-md w-64 fixed h-full transition-transform transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-20 flex items-center justify-center">
          <h1 className="text-xl font-bold">Reports Scheduler</h1>
        </div>
        <div className="flex-1 flex flex-col justify-center mt-5">
          <ul className="space-y-2">
            <li
              className={`flex items-center px-4 py-5 mx-auto w-4/5 rounded-xl cursor-pointer ${
                selectedMenu === 'Dashboard' ? 'bg-[#9854CB] text-white' : 'hover:bg-gray-200'
              }`}
              onClick={() => handleMenuClick('Dashboard')}
            >
              <FaHome className="mr-2" />
              <span>Dashboard</span>
            </li>
            <li
              className={`flex items-center px-4 py-5 mx-auto w-4/5 rounded-xl cursor-pointer ${
                selectedMenu === 'Report List' ? 'bg-[#9854CB] text-white' : 'hover:bg-gray-200'
              }`}
              onClick={() => handleMenuClick('Report List')}
            >
              <FaCalendarAlt className="mr-2" />
              <span>Report List</span>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Navigation */}
        <nav className="bg-white shadow-md fixed w-full z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center md:hidden">
                <button onClick={toggleDrawer} className="text-gray-500 focus:outline-none">
                  <FaBars size={24} />
                </button>
              </div>
              <div className="flex-1 flex justify-end items-center relative" ref={dropdownRef}>
                {userData && (
                  <>
                    {/* Profile Section */}
                    <div
                      className="flex items-center space-x-4 cursor-pointer"
                      onClick={toggleDropdown}
                    >
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
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                          onClick={handleLogout}
                        >
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

        {/* Dashboard Content */}
        <div className="pt-16">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-8">Welcome to the Dashboard</h1>
              {userData ? (
                <div className="mb-8">
                  <p><strong>ID:</strong> {userData.id}</p>
                  <p><strong>Name:</strong> {userData.name}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Role:</strong> {userData.role}</p>
                  <p><strong>Timezone:</strong> {userData.timezone}</p>
                </div>
              ) : (
                <p>Loading user data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
