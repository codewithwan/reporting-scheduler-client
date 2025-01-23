import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../services/api";
import {
  FaFilter,
  FaRedo,
  FaChevronDown,
} from "react-icons/fa";
import { UserData } from "../models/UserData";
import { Calendar } from "react-native-calendars";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import MainLayout from "../components/MainLayout";

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
    <MainLayout>
      {/* Main Grid */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 grid grid-rows-[auto_1fr] gap-4">
        {/* Top Row */}
        <div className="grid grid-cols-3 gap-4 sm:h-20">
          {/* Filter Section */}
          <div className="col-span-2 flex sm:flex-wrap flex-nowrap items-stretch border rounded-md shadow-md">
            {/* Filter Buttons */}
            <span className="flex items-center justify-center sm:px-4 ps-3 bg-gray-50 text-gray-500 font-medium border-gray-300 rounded-l-md">
              <FaFilter />
            </span>

            <span className="flex items-center justify-center sm:px-4 ps-1 pe-3 bg-gray-50 text-gray-700 font-medium sm:text-base text-sm sm:border-l border-gray-300">
              Filter By
            </span>

            {/* Hidden on small screens */}
            <div className="hidden sm:flex items-center justify-between flex-1 px-4 bg-gray-50 text-gray-700 font-medium border-l border-gray-300 hover:bg-gray-100 focus:outline-none cursor-pointer">
              <span>yyyy-mm-dd</span>
              <FaChevronDown className="ml-2" />
            </div>

            <div className="hidden sm:flex items-center justify-between flex-1 px-4 bg-gray-50 text-gray-700 font-medium border-l border-gray-300 hover:bg-gray-100 focus:outline-none cursor-pointer">
              <span>Order Type</span>
              <FaChevronDown className="ml-2" />
            </div>

            <div className="flex items-center justify-around flex-1 px-3 bg-gray-50 text-gray-700 font-medium border-l border-gray-300 rounded-r-md hover:bg-gray-100 focus:outline-none cursor-pointer">
              <span>City</span>
              <FaChevronDown className="ml-2" />
            </div>

            {/* Reset Button (hidden on small screens) */}
            <button className="hidden sm:flex items-center justify-center px-4 bg-gray-50 text-red-500 font-medium border-l border-gray-300 rounded-r-md hover:bg-red-50 focus:outline-none">
              <FaRedo className="mr-2" />
              Reset Filter
            </button>
          </div>

          {/* Create Button Section */}
          <div className="flex sm:items-center justify-center items-stretch sm:shadow-none shadow-md">
            <button className="bg-purple-600 text-white w-full sm:w-auto sm:px-20 py-3 sm:h-[calc(70%)] rounded-md shadow-md hover:bg-purple-700">
              + Create
            </button>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Calendar Section (2/3 of row height) */}
          <div className="sm:block hidden sm:col-span-2 col-span-1 bg-white shadow-md p-4 rounded-md h-[calc(100vh-120px)]">
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
          <div className="bg-white shadow-md p-4 rounded-md h-[calc((100vh-320px)/2)] w-full">
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
    </MainLayout>
  );
};

export default Dashboard;
