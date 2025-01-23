import { useEffect, useState, useRef } from "react";
import { fetchUserProfile } from "../services/api";
import {
  FaFilter,
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, setIsDrawerOpen] = useState(false);

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

  const handleDateClick = (info: any) => {
    console.log("date click", info);
  };

  const handleDateSelect = (selectInfo: any) => {
    console.log(`Selected dates: ${selectInfo.startStr} to ${selectInfo.endStr}`);
  };

  const events = [
    { title: "Team Meeting", date: "2025-01-20" },
    { title: "Project Deadline", date: "2025-01-25" },
  ];

  return (
    <div className="min-h-screen px-4 pt-10 bg-gray-100 font-poppins flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Main Grid */}
        <div className="grid grid-rows-[auto_1fr] gap-4">
          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <FilterSection />
            <CreateButtonSection />
          </div>
          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CalendarSection events={events} handleDateClick={handleDateClick} handleDateSelect={handleDateSelect} />
            <ReportSection events={events} />
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSection = () => (
  <div className="col-span-2 flex items-stretch space-x-0 border rounded-md shadow-md">
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
);

const CreateButtonSection = () => (
  <div className="bg-white shadow-md p-4 rounded-md flex items-center justify-between">
    <h2 className="text-lg font-bold">Create</h2>
    <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
      + Create
    </button>
  </div>
);

const CalendarSection = ({ events, handleDateClick, handleDateSelect }: { events: any[], handleDateClick: (info: any) => void, handleDateSelect: (selectInfo: any) => void }) => (
  <div className="col-span-1 md:col-span-2 bg-white shadow-md p-4 rounded-md h-[calc(100vh-120px)]">
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "today,prev",
        center: "title",
        right: "next,timeGridWeek,dayGridMonth",
      }}
      events={events}
      dateClick={handleDateClick}
      selectable={true}
      select={handleDateSelect}
      height="auto"
    />
  </div>
);

const ReportSection = ({ events }: { events: any[] }) => (
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
);

export default Dashboard;
