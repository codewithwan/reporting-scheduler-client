import React, { useState } from "react";
import { FaFilter, FaRedo, FaChevronDown } from "react-icons/fa";
import MainLayout from "../components/MainLayout";

const ReportList = () => {
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

  const handleAccept = (id: number) => {
    alert(`Accepted report with ID: ${id}`);
    // Implementasikan logika Accept di sini
  };

  const handleReschedule = (id: number) => {
    alert(`Rescheduled report with ID: ${id}`);
    // Implementasikan logika Reschedule di sini
  };

  const handleReject = (id: number) => {
    alert(`Rejected report with ID: ${id}`);
    // Implementasikan logika Reject di sini
  };

  return (
    <MainLayout>
      <div className="pt-20 px-4 sm:px-6 lg:px-8 grid gap-4">
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
                    {report.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b">
                    {report.engineer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium border-b text-center">
                    <span
                      className={`${
                        report.status === "Completed"
                          ? "text-green-600"
                          : report.status === "Processing"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center border-b space-x-2">
                    <button
                      onClick={() => handleAccept(report.id)}
                      className="px-3 py-2 text-sm font-medium text-green-800 bg-green-200 rounded-md hover:text-white hover:bg-green-500 whitespace-nowrap"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReschedule(report.id)}
                      className="px-2 py-2 text-sm font-medium text-blue-800 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500 whitespace-nowrap"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleReject(report.id)}
                      className="px-3 py-2 text-sm font-medium text-red-800 bg-red-200 rounded-md hover:text-white hover:bg-red-500 whitespace-nowrap"
                    >
                      Reject
                    </button>
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
                  {report.name}
                </h3>
                <div className="text-sm text-gray-500">
                  <p className="flex">
                    <span className="w-1/3 font-bold">ENGINEER</span>
                    <span className="w-2/3 font-semibold">: {report.engineer}</span>
                  </p>
                  <p className="flex">
                    <span className="w-1/3 font-bold">DATE</span>
                    <span className="w-2/3 font-semibold">: {report.date}</span>
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
                      <span className="text-gray-500">:</span> {report.status}
                    </span>
                  </p>
                </div>
                <div className="flex items-center justify-between gap-x-2 mt-4 border-t pt-2">
                  <button
                    onClick={() => handleAccept(report.id)}
                    className="w-2/6 py-2 text-sm font-medium text-green-600 bg-green-200 rounded-md hover:text-white hover:bg-green-500"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReschedule(report.id)}
                    className="w-3/6 px-2 py-2 text-sm font-medium text-blue-600 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleReject(report.id)}
                    className="w-2/6 py-2 text-sm font-medium text-red-600 bg-red-200 rounded-md hover:text-white hover:bg-red-500"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportList;
