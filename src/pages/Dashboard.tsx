import { useEffect, useState, useRef } from "react";
import { fetchUserProfile } from "../services/api";
import { FaFilter, FaRedo, FaChevronDown } from "react-icons/fa";
import { UserData } from "../models/UserData";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import MainLayout from "../components/MainLayout";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [todayDate, setTodayDate] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
    // Mendapatkan tanggal hari ini
    const date = new Date();

    // Array untuk nama hari dan bulan
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Days of the week
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Format date
    const formattedDate = `${days[date.getDay()]}, ${
      months[date.getMonth()]
    } ${date.getDate()}`;

    setTodayDate(formattedDate);
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

  const [reports, setReports] = useState([
    {
      id: 1,
      name: "Server Maintenance",
      engineer: "John Doe",
      date: "2025-01-22",
      status: "Pending",
    },
    {
      id: 2,
      name: "Network Input",
      engineer: "Jane Mith",
      date: "2025-01-23",
      status: "Completed",
    },
    {
      id: 3,
      name: "Network Upgrade",
      engineer: "Jane Smith",
      date: "2025-01-23",
      status: "Pending",
    },
    {
      id: 4,
      name: "Network Upgrade",
      engineer: "Jane Smith",
      date: "2025-01-23",
      status: "Processing",
    },
    {
      id: 5,
      name: "Network Upgrade",
      engineer: "Jane Smith",
      date: "2025-01-23",
      status: "Pending",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const maxItemsPerPage = 3;

  // Calculate the total number of pages
  const totalPages = Math.ceil(reports.length / maxItemsPerPage);

  // Get the items for the current page
  const startIndex = (currentPage - 1) * maxItemsPerPage;
  const currentReports = reports.slice(
    startIndex,
    startIndex + maxItemsPerPage
  );

  // Handler untuk mengganti bulan
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(event.target.value, 10);
    setSelectedMonth(newMonth);

    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(new Date(selectedYear, newMonth, 1));
    }
  };

  // Handler untuk mengganti tahun
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value, 10);
    setSelectedYear(newYear);

    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(new Date(newYear, selectedMonth, 1));
    }
  };

  // Navigasi Prev dan Next
  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
      const newDate = calendarApi.getDate();
      setSelectedMonth(newDate.getMonth());
      setSelectedYear(newDate.getFullYear());
    }
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
      const newDate = calendarApi.getDate();
      setSelectedMonth(newDate.getMonth());
      setSelectedYear(newDate.getFullYear());
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleTodayClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();

      // Ambil tanggal hari ini
      const today = new Date();

      // Perbarui state untuk bulan dan tahun
      setSelectedMonth(today.getMonth()); // Bulan mulai dari 0 (Jan = 0, Feb = 1, ...)
      setSelectedYear(today.getFullYear());
    }
  };

  const events = [
    { title: "09:47", date: "2025-01-20", extendedProps: { color: "red" } },
    { title: "20:17", date: "2025-01-20", extendedProps: { color: "green" } },
  ];

  return (
    <MainLayout>
      {/* Main Grid */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 grid grid-rows-[auto_1fr] gap-4">
        {/* Top Row */}
        <div className="grid grid-cols-6 gap-4 sm:h-20 items-stretch">
          {/* Filter Section */}
          <div className="sm:col-span-5 col-span-4 flex sm:flex-wrap flex-nowrap items-stretch border sm:rounded-lg rounded-md shadow-md">
            {/* Filter Buttons */}
            <span className="flex items-center justify-center sm:px-4 ps-3 bg-gray-50 text-gray-500 font-medium border-gray-300 sm:rounded-l-lg rounded-l-md">
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

            <div className="flex items-center justify-between flex-1 sm:px-4 px-3 bg-gray-50 text-gray-700 font-medium border-l border-gray-300 sm:rounded-r-lg rounded-r-md hover:bg-gray-100 focus:outline-none cursor-pointer">
              <span>City</span>
              <FaChevronDown className="ml-2" />
            </div>

            {/* Reset Button (hidden on small screens) */}
            <button className="hidden sm:flex items-center justify-center px-4 bg-gray-50 text-red-500 font-medium border-l border-gray-300 sm:rounded-r-lg rounded-r-md hover:bg-red-50 focus:outline-none">
              <FaRedo className="mr-2" />
              Reset Filter
            </button>
          </div>

          {/* Create Button Section */}
          <div className="sm:col-span-1 col-span-2 flex items-center sm:rounded-lg rounded-md shadow-md">
            <button className="bg-purple-600 text-white py-3 font-medium w-full h-[calc(100%)] sm:text-xl text-sm sm:rounded-lg rounded-md shadow-md hover:bg-purple-700 transition-all duration-200">
              + Create
            </button>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Small screen: Compact Calendar */}
          <div className="sm:hidden">
            <div className="bg-white shadow-md rounded-md">
              <div className="flex flex-col items-start space-y-2 p-4 px-5 text-white sm:space-y-4 bg-purple-600 rounded-t-md">
                {/* Tombol Today */}
                <button
                  onClick={handleTodayClick}
                  className="text-xs font-thin mb-5"
                >
                  TODAY
                </button>

                {/* Today information */}
                <div className="text-2xl font-medium">{todayDate}</div>
              </div>

              {/* FullCalendar Komponen */}
              <div className="p-4">
                <div className="flex justify-between items-center">
                  {/* Dropdown untuk bulan dan tahun */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      className="hover:outline-none"
                    >
                      {months.map((month: string, index: number) => (
                        <option key={index} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={handleYearChange}
                      className="px-2 hover:outline-none"
                    >
                      {Array.from({ length: 21 }, (_, i) => {
                        const year = new Date().getFullYear() - 10 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Tombol navigasi Prev dan Next */}
                  <div className="flex items-center space-x-2">
                    <button onClick={handlePrev}>
                      <FiChevronLeft size={20} />
                    </button>
                    <button onClick={handleNext}>
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Kalender */}
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: "",
                    right: "",
                  }}
                  contentHeight="auto"
                  events = {events}
                  eventContent={(eventInfo) => (
                    <div className="flex items-center">
                      {/* Teks event dengan warna bergantian */}
                      <span
                        className={`font-semibold ${
                          eventInfo.event._def.extendedProps.color === "green"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {eventInfo.event.title}
                      </span>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          {/* Larger screen: Full Calendar */}
          <div className="hidden sm:grid col-span-2">
            <div className="bg-white shadow-md p-4 rounded-md">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "today,prev",
                  center: "title",
                  right: "next,dayGridDay,timeGridWeek,dayGridMonth",
                }}
                contentHeight="auto"
                events={events}
                // dateClick={handleDateClick}
                eventContent={(eventInfo) => (
                  <div className="flex items-center">
                    {/* Titik biru di kiri */}
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></div>
                    {/* Teks event dengan warna bergantian */}
                    <span
                      className={`font-semibold ${
                        eventInfo.event._def.extendedProps.color === "green"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {eventInfo.event.title}
                    </span>
                  </div>
                )}
              />
            </div>
          </div>
          {/* Report Section */}
          <div className="bg-white shadow-md p-4 rounded-lg w-full">
            <h2 className="text-lg font-bold mb-2">Reports</h2>

            <div className="pb-10 flex flex-col h-full justify-between">
              {/* Wrapper with fixed height */}
              <div className="space-y-5 pt-5">
                {currentReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white p-4 shadow-md rounded-md border-t"
                  >
                    <h3 className="text-sm font-medium text-gray-700 mb-2 border-b pb-2">
                      {report.name}
                    </h3>
                    <div className="text-sm text-gray-500">
                      <p className="flex">
                        <span className="w-1/3 font-bold">ENGINEER</span>
                        <span className="w-2/3 font-semibold">
                          : {report.engineer}
                        </span>
                      </p>
                      <p className="flex">
                        <span className="w-1/3 font-bold">DATE</span>
                        <span className="w-2/3 font-semibold">
                          : {report.date}
                        </span>
                      </p>
                      <p className="flex">
                        <span className="w-1/3 font-bold">STATUS</span>
                        <span
                          className={`w-2/3 font-semibold ${
                            report.status === "Completed"
                              ? "text-green-600"
                              : report.status === "Processing"
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          <span className="text-gray-500">:</span>{" "}
                          {report.status}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
