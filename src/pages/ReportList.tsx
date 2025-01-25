import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import FilterSection from "../components/FilterSection";
import CreateButton from "../components/CreateButton";
import LoadingOverlay from "../components/LoadingOverlay";
import { fetchUserProfile, fetchSchedules, updateScheduleStatus } from "../services/api";
import CreateScheduleModal from "../components/CreateScheduleModal";
import { Schedule } from "../models/Schedule";
import { toReadableGMT7 } from "../utils/dateUtils";

const ReportList = () => {
  const [reports, setReports] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Schedule | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetchSchedules();
        const schedules: Schedule[] = response.data.map((schedule: Schedule) => ({
          ...schedule,
          executeAt: toReadableGMT7(schedule.executeAt),
        }));
        setReports(schedules);
      } catch (error) {
        // console.error("Failed to fetch reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await fetchUserProfile();
        setUserRole(response.data.role);
        if (response.data.role !== 'engineer') {
          // Fetch additional user data if role is not engineer
          // ...fetch additional data logic...
        }
      } catch (error) {
        // console.error("Failed to fetch user role:", error);
      }
    };

    fetchReports();
    fetchUserRole();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await updateScheduleStatus(id, "ACCEPTED");
      // Optionally, refetch the reports to update the UI
      const response = await fetchSchedules();
      const schedules: Schedule[] = response.data.map((schedule: Schedule) => ({
        ...schedule,
        executeAt: toReadableGMT7(schedule.executeAt),
      }));
      setReports(schedules);
    } catch (error) {
      // console.error("Failed to accept report:", error);
    }
  };

  const handleReschedule = (report: Schedule) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleReject = async (id: string) => {
    try {
      await updateScheduleStatus(id, "REJECTED");
      // Optionally, refetch the reports to update the UI
      const response = await fetchSchedules();
      const schedules: Schedule[] = response.data.map((schedule: Schedule) => ({
        ...schedule,
        executeAt: toReadableGMT7(schedule.executeAt),
      }));
      setReports(schedules);
    } catch (error) {
      // console.error("Failed to reject report:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <MainLayout>
      {isLoading && <LoadingOverlay />}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 grid gap-4">
        <div className="grid grid-cols-6 gap-4 sm:h-20 items-stretch">
          <FilterSection />
          <CreateButton userRole={userRole} onClick={handleOpenModal} />
        </div>

        {/* Report List Table */}
        <div className="md:bg-white bg-none md:shadow-md shadow-none rounded-md overflow-hidden">
          <table className="min-w-full table-auto border-collapse border border-gray-200 hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                  NAME
                </th>
                <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                  ENGINEER
                </th>
                <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                  DATE
                </th>
                <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b text-center">
                  STATUS
                </th>
                <th className="px-6 py-3 text-center text-xs font-large text-gray-500 uppercase border-b text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 border-b">
                    {report.taskName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b">
                    {report.engineerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b">
                    {report.executeAt}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium border-b text-center">
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
                  <td className="px-6 py-4 text-center border-b space-x-2 h-16">
                    {report.status === "PENDING" && (
                      <>
                        {userRole === "ENGINEER" && (
                          <>
                            <button
                              onClick={() => handleAccept(report.id)}
                              className="px-3 py-2 text-sm font-medium text-green-800 bg-green-200 rounded-md hover:text-white hover:bg-green-500 whitespace-nowrap"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReschedule(report)}
                              className="px-2 py-2 text-sm font-medium text-blue-800 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500 whitespace-nowrap"
                            >
                              Reschedule
                            </button>
                          </>
                        )}
                        {userRole === "ADMIN" && (
                          <>
                            <button
                              onClick={() => handleReschedule(report)}
                              className="px-2 py-2 text-sm font-medium text-blue-800 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500 whitespace-nowrap"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleReject(report.id)}
                              className="px-3 py-2 text-sm font-medium text-red-800 bg-red-200 rounded-md hover:text-white hover:bg-red-500 whitespace-nowrap"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </>
                    )}
                    {report.status === "RESCHEDULED" && (
                      <>
                        {userRole === "ADMIN" && (
                          <>
                            <button
                              onClick={() => handleAccept(report.id)}
                              className="px-3 py-2 text-sm font-medium text-green-800 bg-green-200 rounded-md hover:text-white hover:bg-green-500 whitespace-nowrap"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(report.id)}
                              className="px-3 py-2 text-sm font-medium text-red-800 bg-red-200 rounded-md hover:text-white hover:bg-red-500 whitespace-nowrap"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </>
                    )}
                    {report.status === "REJECTED" && userRole === "ENGINEER" && (
                      <button
                        onClick={() => handleAccept(report.id)}
                        className="px-3 py-2 text-sm font-medium text-green-800 bg-green-200 rounded-md hover:text-white hover:bg-green-500 whitespace-nowrap"
                      >
                        Accept
                      </button>
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
                    <span className="w-2/3 font-semibold">: {report.engineerName}</span>
                  </p>
                  <p className="flex">
                    <span className="w-1/3 font-bold">DATE</span>
                    <span className="w-2/3 font-semibold">: {report.executeAt}</span>
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
                <div className="flex items-center justify-between gap-x-2 mt-4 border-t pt-2 h-16">
                  {report.status === "PENDING" && (
                    <>
                      {userRole === "ENGINEER" && (
                        <>
                          <button
                            onClick={() => handleAccept(report.id)}
                            className="w-2/6 py-2 text-sm font-medium text-green-600 bg-green-200 rounded-md hover:text-white hover:bg-green-500"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReschedule(report)}
                            className="w-3/6 px-2 py-2 text-sm font-medium text-blue-600 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                          >
                            Reschedule
                          </button>
                        </>
                      )}
                      {userRole === "ADMIN" && (
                        <>
                          <button
                            onClick={() => handleReschedule(report)}
                            className="w-3/6 px-2 py-2 text-sm font-medium text-blue-600 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleReject(report.id)}
                            className="w-2/6 py-2 text-sm font-medium text-red-600 bg-red-200 rounded-md hover:text-white hover:bg-red-500"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </>
                  )}
                  {report.status === "RESCHEDULED" && (
                    <>
                      {userRole === "ADMIN" && (
                        <>
                          <button
                            onClick={() => handleAccept(report.id)}
                            className="w-2/6 py-2 text-sm font-medium text-green-600 bg-green-200 rounded-md hover:text-white hover:bg-green-500"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(report.id)}
                            className="w-2/6 py-2 text-sm font-medium text-red-600 bg-red-200 rounded-md hover:text-white hover:bg-red-500"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </>
                  )}
                  {report.status === "REJECTED" && userRole === "ENGINEER" && (
                    <button
                      onClick={() => handleAccept(report.id)}
                      className="w-2/6 py-2 text-sm font-medium text-green-600 bg-green-200 rounded-md hover:text-white hover:bg-green-500"
                    >
                      Accept
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CreateScheduleModal isOpen={isModalOpen} onClose={handleCloseModal} report={selectedReport} />
    </MainLayout>
  );
};

export default ReportList;
