import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { fetchUserProfile } from '../services/api';
import { UserData } from '../models/UserData';

const Layout = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutsideDrawer = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDrawer);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDrawer);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
    switch (menu) {
      case 'Dashboard':
        navigate('/dashboard');
        break;
      case 'Report List':
        navigate('/report-list');
        break;
      case 'Users':
        navigate('/users');
        break;
      default:
        break;
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-poppins flex">
      <Sidebar selectedMenu={selectedMenu} handleMenuClick={handleMenuClick} userData={userData} isDrawerOpen={isDrawerOpen} />
      <div className="flex-1 md:ml-64">
        <Navbar
          userData={userData}
          dropdownOpen={dropdownOpen}
          toggleDropdown={toggleDropdown}
          handleLogout={handleLogout}
          isDrawerOpen={isDrawerOpen}
          toggleDrawer={toggleDrawer}
          dropdownRef={dropdownRef}
        />
        <div className="pt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
