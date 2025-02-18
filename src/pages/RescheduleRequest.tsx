import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  fetchUserProfile,
  fetchReschedules,
  fetchSchedules,
  fetchUsers,
  updateRescheduleStatus,
  updateScheduleStatus,
} from "../services/api";
import { Reschedule } from "../models/Reschedule";
import FilterSection from "../components/FilterSection";
import { Schedule } from "../models/Schedule";
import { Engineer } from "../models/Engineer";

const RescheduleRequest = () => {
  const [, setReschedules] = useState<Reschedule[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [filteredReschedules, setFilteredReschedules] = useState<Reschedule[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [, setUserRole] = useState<string>("");
  const [, setUserId] = useState<string>("");

  useEffect(() => {
    const getSchedules = async () => {
      try {
        const response = await fetchSchedules();
        setSchedules(response.data);
      } catch (error) {
        console.error("Error fetching Schedules:", error);
      }
    };

    const getEngineers = async () => {
      try {
        const response = await fetchUsers();
        setEngineers(response.data);
      } catch (error) {
        console.error("Error fetching Engineers:", error);
      }
    };

    getEngineers();
    getSchedules();
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const userProfile = await fetchUserProfile();
      setUserRole(userProfile.data.role);
      setUserId(userProfile.data.id);

      const reschedulesData = await fetchReschedules();
      let filteredData = reschedulesData.data;

      if (userProfile.data.role === "ENGINEER") {
        filteredData = filteredData.filter(
          (item: Reschedule) => item.requestedBy === userProfile.data.id
        );
      }

      setReschedules(filteredData);
      setFilteredReschedules(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (rescheduleId: string, scheduleId: string) => {
    try {
      // Update status reschedule
      await updateRescheduleStatus(rescheduleId, "APPROVED");

      // Update status schedule
      await updateScheduleStatus(scheduleId, "ACCEPTED");

      // Update state locally
      setReschedules((prev) =>
        prev.map((reschedule) =>
          reschedule.id === rescheduleId
            ? { ...reschedule, status: "ACCEPTED" }
            : reschedule
        )
      );
      window.location.href = window.location.href;
    } catch (error) {
      console.error("Error updating status to ACCEPTED:", error);
    }
  };

  const handleReject = async (rescheduleId: string, scheduleId: string) => {
    try {
      // Update status reschedule
      await updateRescheduleStatus(rescheduleId, "REJECTED");

      // Update status schedule
      await updateScheduleStatus(scheduleId, "CANCELED");

      // Update state locally
      setReschedules((prev) =>
        prev.map((reschedule) =>
          reschedule.id === rescheduleId
            ? { ...reschedule, status: "REJECTED" }
            : reschedule
        )
      );
      window.location.href = window.location.href;
    } catch (error) {
      console.error("Error updating status to REJECTED:", error);
    }
  };

  return (
    <MainLayout>
      {isLoading && <LoadingOverlay />}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 grid gap-4">
        <div className="grid grid-cols-1 gap-4 h-15 items-stretch">
          <FilterSection />
        </div>

        <div className="hidden sm:block">
          <div className="md:bg-white bg-none md:shadow-md shadow-none rounded-md overflow-hidden">
            <table className="min-w-full table-auto border-collapse border border-gray-200 hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                    Schedule ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                    Requested By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                    New Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReschedules.map((reschedule) => (
                  <tr key={reschedule.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 border-b">
                      {schedules.find(
                        (schedule) => schedule.id === reschedule.scheduleId
                      )?.taskName || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {engineers.find(
                        (engineer) => engineer.id === reschedule.requestedBy
                      )?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {reschedule.reason}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {new Date(reschedule.newDate).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-gray-700 border-b ${
                        reschedule.status === "APPROVED"
                          ? "text-green-600"
                          : reschedule.status === "REJECTED"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {reschedule.status}
                    </td>
                    {reschedule.status === "PENDING" ? (
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 border-b">
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={() =>
                            handleAccept(reschedule.id, reschedule.scheduleId)
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="ml-4 text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleReject(reschedule.id, reschedule.scheduleId)
                          }
                        >
                          Reject
                        </button>
                      </td>
                    ) : (
                      ""
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:hidden">
          {filteredReschedules.map((reschedule) => (
            <div
              key={reschedule.id}
              className="bg-white p-4 shadow-md rounded-md"
            >
              <h3 className="text-sm font-medium text-gray-700 mb-2 border-b pb-2">
                {engineers.find(
                  (engineer) => engineer.id === reschedule.requestedBy
                )?.name || "Unknown"}
              </h3>
              <div className="text-sm text-gray-500">
                <p className="flex">
                  <span className="w-1/3 font-bold">TASK</span>
                  <span className="w-2/3 font-semibold">
                    :{" "}
                    {schedules.find(
                      (schedule) => schedule.id === reschedule.scheduleId
                    )?.taskName || "Unknown"}
                  </span>
                </p>
                <p className="flex">
                  <span className="w-1/3 font-bold">REASON</span>
                  <span className="w-2/3 font-semibold">
                    : {reschedule.reason}
                  </span>
                </p>
                <p className="flex">
                  <span className="w-1/3 font-bold">STATUS</span>
                  <span
                    className={`w-2/3 font-semibold ${
                      reschedule.status === "APPROVED"
                        ? "text-green-600"
                        : reschedule.status === "REJECTED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    <span className="text-gray-500">:</span> {reschedule.status}
                  </span>
                </p>
                {reschedule.status === "PENDING" ? (
                  <div className="mt-2">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() =>
                        handleAccept(reschedule.id, reschedule.scheduleId)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="ml-4 text-red-500 hover:text-red-700"
                      onClick={() =>
                        handleReject(reschedule.id, reschedule.scheduleId)
                      }
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default RescheduleRequest;
