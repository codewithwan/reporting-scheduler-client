import { useEffect, useState, useRef } from "react";
import { fetchUserProfile, fetchSchedules } from "../services/api";
import { UserData } from "../models/UserData";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import MainLayout from "../components/MainLayout";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import LoadingOverlay from "../components/LoadingOverlay";
import FilterSection from "../components/FilterSection";
import CreateButton from "../components/CreateButton";
import CreateScheduleModal from "../components/CreateScheduleModal";
import { toGMT7, toReadableGMT7 } from "../utils/dateUtils";
import { Schedule } from "../models/Schedule";

const Dashboard = () => {
  const [, setUserData] = useState<UserData | null>(null);
  const [, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, setIsDrawerOpen] = useState(false);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [todayDate, setTodayDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
        setUserRole(response.data.role);
        if (response.data.role !== "engineer") {
          // Fetch additional user data if role is not engineer
          // ...fetch additional data logic...
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
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

  const [reports, setReports] = useState<Schedule[]>([]);

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

  const [events, setEvents] = useState<
    {
      title: string;
      start: string | Date;
      end?: string | Date;
      extendedProps: { color: string };
    }[]
  >([]);

  useEffect(() => {
    const getSchedules = async () => {
      try {
        const response = await fetchSchedules();
        const schedules: Schedule[] = response.data.map(
          (schedule: Schedule) => ({
            ...schedule,
            startDate: toGMT7(new Date(schedule.startDate)),
            endDate: schedule.endDate
              ? toGMT7(new Date(schedule.endDate))
              : null,
          })
        );

        const calendarEvents = schedules.map((schedule) => {
          const startDate = new Date(schedule.startDate + "Z"); // Tambahkan "Z" untuk memaksa UTC
          const endDate = schedule.endDate
            ? new Date(schedule.endDate + "Z")
            : null;

          return {
            title: `${schedule.taskName} - ${startDate.toLocaleTimeString(
              "en-US",
              {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Jakarta",
              }
            )}`,

            start: startDate.toISOString(),
            end: endDate ? endDate.toISOString() : startDate.toISOString(),

            extendedProps: {
              color:
                schedule.status === "ACCEPTED"
                  ? "green"
                  : schedule.status === "RESCHEDULED"
                  ? "blue"
                  : schedule.status === "PENDING"
                  ? "yellow"
                  : schedule.status === "REJECTED"
                  ? "red"
                  : "gray",
            },
          };
        });

        setEvents(calendarEvents);
        setReports(schedules);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      }
    };

    getSchedules();
  }, []);

  return (
    <MainLayout>
      {isLoading && <LoadingOverlay />}
      {/* Main Grid */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 grid grid-rows-[auto_1fr] gap-4">
        {/* Top Row */}
        <div className="grid grid-cols-6 gap-4 h-15 items-stretch">
          <FilterSection />
          <CreateButton userRole={userRole} onClick={handleOpenModal} />
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
                  events={events}
                  eventContent={(eventInfo) => {
                    const { color } = eventInfo.event.extendedProps;

                    return (
                      <div className="flex items-center">
                        {/* Nama event dengan highlight warna status */}
                        <span
                          className={`font-semibold px-1 rounded ${
                            color === "green"
                              ? "bg-green-300 text-green-700"
                              : color === "blue"
                              ? "bg-blue-300 text-blue-700"
                              : color === "yellow"
                              ? "bg-yellow-300 text-yellow-700"
                              : color === "red"
                              ? "bg-red-300 text-red-700"
                              : "bg-gray-300 text-gray-700"
                          }`}
                        >
                          {eventInfo.event.title}
                        </span>
                      </div>
                    );
                  }}
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
                events={events.map((event) => ({
                  title: event.title,
                  start: event.start,
                  end: event.end,
                  extendedProps: {
                    color: event.extendedProps.color,
                  },
                }))}
                eventContent={(eventInfo) => {
                  const { color } = eventInfo.event.extendedProps;

                  return (
                    <div className="flex items-center">
                      {/* Nama event dengan highlight warna status */}
                      <span
                        className={`font-semibold px-1 rounded ${
                          color === "green"
                            ? "bg-green-300 text-green-700"
                            : color === "blue"
                            ? "bg-blue-300 text-blue-700"
                            : color === "yellow"
                            ? "bg-yellow-300 text-yellow-700"
                            : color === "red"
                            ? "bg-red-300 text-red-700"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {eventInfo.event.title}
                      </span>
                    </div>
                  );
                }}
              />
            </div>
          </div>
          {/* Report Section */}
          <div className="bg-white shadow-md p-4 rounded-lg w-full max-h-[620px]">
            <h2 className="text-lg font-bold">Reports</h2>

            <div className="pb-10 flex flex-col h-full justify-between">
              {/* Wrapper with fixed height */}
              <div className="space-y-2 pt-5">
                {currentReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white p-4 shadow-md rounded-md border-t"
                  >
                    <h3 className="text-sm font-medium text-gray-700 mb-2 border-b pb-2">
                      {report.taskName}
                    </h3>
                    <div className="text-sm text-gray-500">
                      <p className="flex">
                        <span className="w-1/3 font-bold">ENGINEER</span>
                        <span className="w-2/3 font-semibold">
                          : {report.engineerName}
                        </span>
                      </p>
                      <p className="flex">
                        <span className="w-1/3 font-bold">START DATE</span>
                        <span className="w-2/3 font-semibold">
                          : {toReadableGMT7(report.startDate)}
                        </span>
                      </p>
                      <p className="flex">
                        <span className="w-1/3 font-bold">END DATE</span>
                        <span className="w-2/3 font-semibold">
                          : {toReadableGMT7(report.endDate)}
                        </span>
                      </p>
                      <p className="flex">
                        <span className="w-1/3 font-bold">STATUS</span>
                        <span
                          className={`w-2/3 font-semibold ${
                            report.status === "ACCEPTED"
                              ? "text-green-600"
                              : report.status === "RESCHEDULED"
                              ? "text-blue-600"
                              : report.status === "PENDING"
                              ? "text-yellow-600"
                              : report.status === "REJECTED"
                              ? "text-red-600"
                              : "text-gray-600"
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
              <div className="flex justify-between items-center">
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
      {(userRole === "ADMIN" || userRole === "SUPERADMIN") && (
        <CreateScheduleModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </MainLayout>
  );
};

export default Dashboard;
