import React from 'react';
import { FaHome, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { UserData } from '../models/UserData';

interface SidebarProps {
  selectedMenu: string;
  handleMenuClick: (menu: string) => void;
  userData: UserData | null;
  isDrawerOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedMenu, handleMenuClick, userData, isDrawerOpen }) => {
  return (
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
          {userData && (userData.role === 'SUPERADMIN' || userData.role === 'ADMIN') && (
            <li
              className={`flex items-center px-4 py-5 mx-auto w-4/5 rounded-xl cursor-pointer ${
                selectedMenu === 'Users' ? 'bg-[#9854CB] text-white' : 'hover:bg-gray-200'
              }`}
              onClick={() => handleMenuClick('Users')}
            >
              <FaUsers className="mr-2" />
              <span>Users</span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
