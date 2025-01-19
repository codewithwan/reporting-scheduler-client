import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../services/api";
import {
  FaHome,
  FaCalendarAlt,
  FaFilter,
  FaBars,
  FaTimes,
  FaRedo,
  FaChevronDown,
} from "react-icons/fa";
import { UserData } from "../models/UserData";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetchUserProfile();
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    getUserData();
  }, []);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideDrawer = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideDrawer);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDrawer);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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

  const handleDateClick = (info: any) => {
    alert(`You clicked on: ${info.dateStr}`);
  };

  const events = [
    { title: "Team Meeting", date: "2025-01-20" },
    { title: "Project Deadline", date: "2025-01-25" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-poppins flex overflow-hidden">
      {/* Sidebar */}
      <nav
        className={`bg-white shadow-md w-64 fixed h-full transition-transform transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-20`}
        aria-label="Sidebar navigation"
      >
        <div className="h-20 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Reports Scheduler
          </h1>
        </div>
        <div className="flex-1 flex flex-col mt-6">
          <ul className="space-y-3">
            <li>
              <button
                className={`flex items-center w-11/12 mx-auto px-4 py-3 rounded-xl ${
                  selectedMenu === "Dashboard"
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleMenuClick("Dashboard")}
                aria-current={selectedMenu === "Dashboard" ? "page" : undefined}
              >
                <FaHome className="mr-3 text-lg" />
                <span className="text-sm sm:text-base lg:text-lg">
                  Dashboard
                </span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-11/12 mx-auto px-4 py-3 rounded-xl ${
                  selectedMenu === "Report List"
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleMenuClick("Report List")}
                aria-current={
                  selectedMenu === "Report List" ? "page" : undefined
                }
              >
                <FaCalendarAlt className="mr-3 text-lg" />
                <span className="text-sm sm:text-base lg:text-lg">
                  Report List
                </span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 overflow-hidden">
        {/* Navbar */}
        <nav className="bg-white shadow-md fixed w-full z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center md:hidden">
                <button
                  onClick={toggleDrawer}
                  className="text-gray-500 focus:outline-none"
                >
                  {isDrawerOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
              </div>
              <div
                className="flex-1 flex justify-end items-center relative"
                ref={dropdownRef}
              >
                {userData && (
                  <>
                    <div
                      className="flex items-center space-x-4 cursor-pointer"
                      onClick={toggleDropdown}
                    >
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <span className="font-medium w-32 truncate hidden md:block">
                        {userData.name}
                      </span>
                    </div>
                    <div
                      className={`absolute top-14 right-0 w-56 bg-white border rounded-md shadow-lg transition-transform ${
                        dropdownOpen ? "scale-100" : "scale-0"
                      } origin-top-right`}
                    >
                      <ul>
                        <li className="px-4 py-2 hover:bg-gray-100">
                          My Account
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100">
                          Settings
                        </li>
                        <li className="border-t"></li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 text-red-500"
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

        {/* Main Grid */}
        <div className="pt-20 px-4 sm:px-6 lg:px-8 grid grid-rows-[auto_1fr] gap-4">
          {/* Top Row */}
          <div className="grid grid-cols-3 gap-4 h-20">
            {/* Filter Section */}
            <div className="col-span-2 flex items-stretch space-x-0 border rounded-md shadow-md">
              {/* Filter Buttons */}
              <button className="flex items-center justify-center px-4 bg-gray-50 text-gray-500 font-medium border-gray-300 rounded-l-md hover:bg-gray-100 focus:outline-none">
                <FaFilter />
              </button>

              <button className="flex items-center justify-center px-4 bg-gray-50 text-gray-700 font-medium border-l border-gray-300 hover:bg-gray-100 focus:outline-none">
                Filter By
              </button>

              <div className="flex items-center justify-between flex-1 px-4 bg-gray-50 text-gray-700 font-medium border-l border-gray-300 hover:bg-gray-100 focus:outline-none">
                <span>yyyy-mm-dd</span>
                <FaChevronDown className="ml-2" />
              </div>

              <div className="flex items-center justify-between flex-1 px-4 bg-gray-50 text-gray-700 font-medium border-l border-gray-300 hover:bg-gray-100 focus:outline-none">
                <span>Order Type</span>
                <FaChevronDown className="ml-2" />
              </div>

              <div className="flex items-center justify-between flex-1 px-3 bg-gray-50 text-gray-700 font-medium border-l border-gray-300 hover:bg-gray-100 focus:outline-none">
                <span>City</span>
                <FaChevronDown className="ml-2" />
              </div>

              <button className="flex items-center justify-center px-4 bg-gray-50 text-red-500 font-medium border-l border-gray-300 rounded-r-md hover:bg-red-50 focus:outline-none">
                <FaRedo className="mr-2" />
                Reset Filter
              </button>
            </div>

            {/* Create Button Section */}
            <div className="bg-white shadow-md p-4 rounded-md flex items-center justify-between">
              <h2 className="text-lg font-bold">Create</h2>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                + Create
              </button>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Calendar Section (2/3 of row height) */}
            <div className="col-span-2 bg-white shadow-md p-4 rounded-md h-[calc(100vh-120px)]">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "today,prev",
                  center: "title",
                  right: "next,dayGridDay,timeGridWeek,dayGridMonth",
                }}
                events={events}
                dateClick={handleDateClick}
              />
            </div>

            {/* Report Section (1/3 of row height) */}
            <div className="bg-white shadow-md p-4 rounded-md h-[calc((100vh-320px)/2)]">
              <h2 className="text-lg font-bold mb-2">Reports</h2>
              <ul className="space-y-2">
                {events.map((event, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md"
                  >
                    <span>{event.title}</span>
                    <span className="text-sm text-gray-500">{event.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
