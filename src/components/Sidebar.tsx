import React from "react";
import { AiFillProduct } from "react-icons/ai";
import { FaHome, FaCalendarAlt } from "react-icons/fa";
import { IoIosPerson } from "react-icons/io";
import { MdEngineering } from "react-icons/md";
import { Link } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaHome />,
    roles: ["ENGINEER", "ADMIN", "SUPERADMIN"],
  },
  {
    name: "Report List",
    path: "/reports",
    icon: <FaCalendarAlt />,
    roles: ["ENGINEER", "ADMIN", "SUPERADMIN"],
  },
  {
    name: "Engineer List",
    path: "/engineers",
    icon: <MdEngineering />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    name: "Customer List",
    path: "/customers",
    icon: <IoIosPerson />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    name: "Product List",
    path: "/products",
    icon: <AiFillProduct />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
];

interface SidebarProps {
  isDrawerOpen: boolean;
  selectedMenu: string;
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isDrawerOpen,
  selectedMenu,
  role,
}) => {
  // Filter menu berdasarkan role pengguna
  const filteredMenu = menuItems.filter((item) => item.roles.includes(role));

  return (
    <nav
      className={`bg-white shadow-md w-64 fixed h-full transition-transform transform ${
        isDrawerOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 z-20`}
    >
      <div className="h-20 flex items-center justify-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Reports Scheduler
        </h1>
      </div>
      <ul className="mt-6 space-y-3">
        {filteredMenu.map(({ name, path, icon }) => (
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
};

export default Sidebar;
