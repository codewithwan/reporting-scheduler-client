import { useState, useEffect, useMemo } from "react";
import MainLayout from "../components/MainLayout";
import FilterSection from "../components/FilterSection";
import CreateButton from "../components/CreateButton";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  fetchUserProfile,
  fetchSchedules,
  updateScheduleStatus,
  fetchUsers,
} from "../services/api";
import CreateScheduleModal from "../components/CreateScheduleModal";
import { Schedule } from "../models/Schedule";
import { toGMT7, toReadableGMT7 } from "../utils/dateUtils";
import { Engineer } from "../models/Engineer";
import RescheduleModal from "../components/RescheduleModal";

const ReportList = () => {
  const [reports, setReports] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [filteredEngineers, setFilteredEngineers] = useState<Engineer[]>([]);
  const [userRole, setUserRole] = useState("");
  const [openModal, setOpenModal] = useState<"create" | "update" | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Schedule | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [minHeight, setMinHeight] = useState("525px");

  useEffect(() => {
    const updateLayout = () => {
      const screenHeight = window.innerHeight;
      const availableHeight = screenHeight - 260;

      const calculatedItems = Math.floor(availableHeight / 75);
      setItemsPerPage(calculatedItems > 0 ? calculatedItems : 1);

      const calculatedMinHeight = calculatedItems * 75;
      setMinHeight(`${calculatedMinHeight}px`);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetchSchedules();
        const schedules: Schedule[] = response.data.map((schedule: any) => ({
          ...schedule,
          startDate: toGMT7(new Date(schedule.startDate)),
          endDate: toGMT7(new Date(schedule.endDate)),
        }));

        // Urutan prioritas status
        const statusPriority = [
          "PENDING",
          "ONGOING",
          "RESCHEDULED",
          "ACCEPTED",
          "COMPLETED",
          "CANCELED",
          "REJECTED",
        ];

        // Sorting berdasarkan status
        schedules.sort(
          (a, b) =>
            statusPriority.indexOf(a.status) - statusPriority.indexOf(b.status)
        );

        setReports(schedules);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await fetchUserProfile();
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };

    fetchReports();
    fetchUserRole();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await updateScheduleStatus(id, "ACCEPTED");
      const response = await fetchSchedules();
      setReports(response.data);
    } catch (error) {
      console.error("Failed to accept report:", error);
    }
  };

  const handleReschedule = (report: Schedule) => {
    setSelectedReport(report);
    setOpenModal("update");
  };

  const handleReject = async (id: string) => {
    try {
      await updateScheduleStatus(id, "REJECTED");
      const response = await fetchSchedules();
      setReports(response.data);
    } catch (error) {
      console.error("Failed to reject report:", error);
    }
  };

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return reports.slice(startIndex, startIndex + itemsPerPage);
  }, [reports, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const handleOpenModal = (type: "create" | "update") => setOpenModal(type);
  const handleCloseModal = () => setOpenModal(null);

  return (
    <MainLayout>
      {isLoading && <LoadingOverlay />}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 grid gap-4">
        <div
          className={`grid ${
            userRole === "ENGINEER" ? "grid-cols-1" : "grid-cols-6"
          } gap-4 h-15 items-stretch`}
        >
          <FilterSection />
          <CreateButton userRole={userRole} onClick={() => handleOpenModal("create")} />
        </div>

        <div style={{ minHeight }}>
          <div className="hiddem sm:block md:bg-white bg-none md:shadow-md shadow-none rounded-md overflow-hidden">
            <table className="min-w-full table-auto border-collapse border border-gray-200 hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/6 ps-4 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                    NAME
                  </th>
                  <th className="w-1/6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                    ENGINEER
                  </th>
                  <th className="w-1/6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                    START DATE
                  </th>
                  <th className="w-1/6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                    END DATE
                  </th>
                  <th className="w-1/7 py-3 text-left text-xs font-large text-gray-500 uppercase border-b text-center">
                    STATUS
                  </th>
                  <th className="w-1/5 py-3 text-center text-xs font-large text-gray-500 uppercase border-b text-center">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-100">
                    <td className="ps-4 py-4 text-sm font-medium text-gray-700 border-b">
                      {report.taskName}
                    </td>
                    <td className="py-4 text-sm text-gray-700 border-b">
                      {report.engineerName}
                    </td>
                    <td className="py-4 text-sm text-gray-700 border-b">
                      {toReadableGMT7(report.startDate)}
                    </td>
                    <td className="py-4 text-sm text-gray-700 border-b">
                      {toReadableGMT7(report.endDate)}
                    </td>
                    <td className="py-4 text-sm font-medium border-b text-center">
                      <span
                        className={`${
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
                        {report.status}
                      </span>
                    </td>
                    <td className="py-4 text-center border-b space-x-2 h-16">
                      {report.status === "PENDING" &&
                        userRole === "ENGINEER" && (
                          <>
                            <button
                              onClick={() => handleAccept(report.id)}
                              className="px-3 py-2 text-sm font-medium text-green-800 bg-green-200 rounded-md hover:text-white hover:bg-green-500"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReschedule(report)}
                              className="px-2 py-2 text-sm font-medium text-blue-800 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                            >
                              Reschedule
                            </button>
                          </>
                        )}
                      {report.status === "PENDING" && userRole === "ADMIN" && (
                        <>
                          <button
                            onClick={() => handleReschedule(report)}
                            className="px-2 py-2 text-sm font-medium text-blue-800 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleReject(report.id)}
                            className="px-3 py-2 text-sm font-medium text-red-800 bg-red-200 rounded-md hover:text-white hover:bg-red-500"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Responsive Version */}
            <div className="flex flex-col space-y-4 md:hidden">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white p-4 shadow-md rounded-md"
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
                        <span className="text-gray-500">:</span> {report.status}
                      </span>
                    </p>
                  </div>
                  {report.status === "PENDING" && (
                    <div className="flex items-center justify-between gap-x-2 mt-4 border-t pt-2 h-16">
                      {userRole === "ENGINEER" && (
                        <>
                          <button
                            onClick={() => handleAccept(report.id)}
                            className="w-1/2 py-2 text-sm font-medium text-green-600 bg-green-200 rounded-md hover:text-white hover:bg-green-500"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReschedule(report)}
                            className="w-1/2 px-2 py-2 text-sm font-medium text-blue-600 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                          >
                            Reschedule
                          </button>
                        </>
                      )}
                      {userRole === "ADMIN" && (
                        <>
                          <button
                            onClick={() => handleReschedule(report)}
                            className="w-1/2 px-2 py-2 text-sm font-medium text-blue-600 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleReject(report.id)}
                            className="w-1/2 py-2 text-sm font-medium text-red-600 bg-red-200 rounded-md hover:text-white hover:bg-red-500"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {report.status === "RESCHEDULED" && (
                    <div className="flex items-center justify-between gap-x-2 mt-4 border-t pt-2 h-16">
                      {userRole === "ADMIN" && (
                        <>
                          <button
                            onClick={() => handleAccept(report.id)}
                            className="w-1/2 py-2 text-sm font-medium text-green-600 bg-green-200 rounded-md hover:text-white hover:bg-green-500"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(report.id)}
                            className="w-1/2 py-2 text-sm font-medium text-red-600 bg-red-200 rounded-md hover:text-white hover:bg-red-500"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {report.status === "REJECTED" && userRole === "ENGINEER" && (
                    <div className="flex items-center justify-between gap-x-2 mt-4 border-t pt-2 h-16">
                      <button
                        onClick={() => handleAccept(report.id)}
                        className="w-1/2 py-2 text-sm font-medium text-green-600 bg-green-200 rounded-md hover:text-white hover:bg-green-500"
                      >
                        Accept
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Pagination Controls */}
        <div className="hidden sm:flex justify-center items-center mt-3 min-h-[40px]">
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-300"
                }`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === page
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {(userRole === "ADMIN" || userRole === "SUPERADMIN") && (
        <CreateScheduleModal isOpen={openModal === "create"} onClose={handleCloseModal} />
      )}
      <RescheduleModal isOpen={openModal === "update"} report={selectedReport} onClose={handleCloseModal} userRole={userRole} />
    </MainLayout>
  );
};

export default ReportList;
