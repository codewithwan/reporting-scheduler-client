import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { Schedule } from "../models/Schedule";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  fetchSchedules,
  fetchUserProfile,
  fetchCustomers,
} from "../services/api";
import { toGMT7 } from "../utils/dateUtils";
import SearchBar from "../components/SearchBar";
import { Customer } from "../models/Customer";

const Todo = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reports, setReports] = useState<Schedule[]>([]);
  const [filteredReports, setFilteredReports] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Schedule | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetchSchedules();
        const schedules: Schedule[] = response.data
          .map((schedule: any) => ({
            ...schedule,
            startDate: toGMT7(new Date(schedule.startDate)),
            endDate: toGMT7(new Date(schedule.endDate)),
          }))
          .filter((schedule: { status: string; }) => schedule.status === "ACCEPTED");
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

    const getCustomers = async () => {
      try {
        const response = await fetchCustomers();
        setCustomers(response.data);
      } catch (error) {
        console.error("Failed to fetch customer:", error);
      }
    };

    getCustomers();
    fetchReports();
    fetchUserRole();
  }, []);

  const handleDetail = (task: Schedule) => {
    setCurrentTask(task);
    setIsDetailOpen(true);
  };

  const handleReport = (task: Schedule) => {
    navigate("/todo/report", { state: { task } });
  };

  return (
    <MainLayout>
      {isLoading && <LoadingOverlay />}
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <SearchBar
          onSearch={(searchTerm) => {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            setFilteredReports(
              reports.filter((r) => {
                return (
                  r.taskName.toLowerCase().includes(lowercasedSearchTerm) ||
                  r.endDate.toLowerCase().includes(lowercasedSearchTerm)
                );
              })
            );
          }}
        />

        <div className="flex flex-col mt-4">
          {reports && reports.length === 0 ? (
            <p className="text-gray-500 mt-4">Tidak ada tugas saat ini.</p>
          ) : (
            reports?.map((report) => (
              <div
                key={report.id}
                className="border bg-white space-y-5 sm:space-y-0 border-2 border-purple-500 p-5 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 w-full shadow-md"
              >
                <div>
                  <p className="font-bold">{report.taskName}</p>
                  <p className="text-gray-500">
                    Deadline:{" "}
                    {new Date(report.endDate).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                    {" ~ "}
                    {new Date(report.endDate).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => handleDetail(report)}
                    className="px-7 py-2 border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white rounded-md"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => handleReport(report)}
                    className="px-7 py-2 border border-purple-500 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
                  >
                    Report
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {isDetailOpen && currentTask && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) =>
            e.target === e.currentTarget && setIsDetailOpen(false)
          }
        >
          <div
            className="bg-white p-6 rounded-md shadow-md w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold pb-2 mb-3 border-b-2 text-gray-700">
              Task Details
            </h2>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Task</strong>:{" "}
              {currentTask.taskName}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Start</strong>:{" "}
              {new Date(currentTask.startDate).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
              {" ~ "}
              {new Date(currentTask.startDate).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Deadline</strong>:{" "}
              {new Date(currentTask.endDate).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
              {" ~ "}
              {new Date(currentTask.endDate).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Location</strong>:{" "}
              {currentTask.location}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Admin</strong>:{" "}
              {currentTask.adminName}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Customer</strong>:{" "}
              {customers.find(
                (customer) => customer.id === currentTask.customerId
              )?.name || "Unknown"}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Activity</strong>:{" "}
              {currentTask.activity}
            </p>
            <div className="flex justify-end mt-4 border-t-2 pt-3 space-x-2">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Todo;
