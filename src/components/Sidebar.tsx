import React from "react";
import { FaHome, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
  { name: "Report List", path: "/reports", icon: <FaCalendarAlt /> },
];

interface SidebarProps {
  isDrawerOpen: boolean;
  selectedMenu: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isDrawerOpen, selectedMenu }) => (
  <nav
    className={`bg-white shadow-md w-64 fixed h-full transition-transform transform ${
      isDrawerOpen ? "translate-x-0" : "-translate-x-full"
    } md:translate-x-0 z-20`}
  >
    <div className="h-20 flex items-center justify-center">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">
        Reports Scheduler
      </h1>
    </div>
    <ul className="mt-6 space-y-3">
      {menuItems.map(({ name, path, icon }) => (
        <li key={name}>
          <Link
            to={path}
            className={`flex items-center w-11/12 mx-auto px-4 py-3 rounded-xl ${
              selectedMenu === path
                ? "bg-purple-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {icon}
            <span className="ml-3">{name}</span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default Sidebar;
