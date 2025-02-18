import React, { useState, useEffect } from "react";
import {
  createReschedule,
  updateScheduleStatus,
} from "../services/api";
import Alert from "./Alert";
import LoadingOverlay from "./LoadingOverlay";
import Notification from "./Notification";
import { Schedule } from "../models/Schedule";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: Schedule | null;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [scheduleID, setScheduleID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [engineer, setEngineer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (report) {
      setScheduleID(report.id);
      setStartDate(new Date(report.startDate).toISOString().split("T")[0]);
      setEndDate(new Date(report.endDate).toISOString().split("T")[0]);
      setEngineer(report.engineer_id);
    }
  }, [report]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(new Date(newStartDate).toISOString().split("T")[0]);

    if (endDate) {
      const previousStartDate = new Date(newStartDate);
      const previousEndDate = new Date(endDate);
      const dayDifference = Math.ceil(
        (previousEndDate.getTime() - previousStartDate.getTime()) /
          (1000 * 3600 * 24)
      );
      const newStartDateObj = new Date(newStartDate);
      newStartDateObj.setDate(newStartDateObj.getDate() + dayDifference);
      setEndDate(newStartDateObj.toISOString().split("T")[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi data yang diperlukan
    if (!scheduleID || !startDate || !endDate || !reason) {
      setAlertMessage("Please fill in all required fields.");
      return;
    }

    const rescheduleData = {
      scheduleId: scheduleID,
      requestedBy: engineer,
      reason: reason,
      newDate: new Date(startDate).toISOString(),
      status: "RESCHEDULED",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      setIsLoading(true);
      await createReschedule(rescheduleData);
      await updateScheduleStatus(scheduleID, "RESCHEDULED");

      // Jika berhasil, menampilkan notifikasi dan menutup modal
      setNotification({
        message: "Reschedule request submitted successfully.",
        type: "success",
      });

      onClose();
      window.location.href = window.location.href;
    } catch (error) {
      setNotification({
        message: "An error occurred while submitting. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {isLoading && <LoadingOverlay />}
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage("")} />
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Schedule</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                disabled
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border rounded resize-none"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;
