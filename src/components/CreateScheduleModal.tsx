import React, { useState, useEffect } from "react";
import { fetchProvinces, fetchCities, fetchUsers, createSchedule, fetchUserProfile, cancelSchedule } from "../services/api";
import { toUTC } from "../utils/dateUtils";
import Alert from "./Alert";
import ConfirmDialog from "./ConfirmDialog";
import LoadingOverlay from "./LoadingOverlay";
import Notification from "./Notification";
import { FaChevronDown } from "react-icons/fa";
import { Schedule } from "../models/Schedule";

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: Schedule | null;
}

const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [engineer, setEngineer] = useState("");
  const [category, setCategory] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [engineers, setEngineers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Fetch provinces data
    const getProvinces = async () => {
      try {
        const response = await fetchProvinces();
        setProvinces(response.data);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };

    getProvinces();

    // Fetch user role
    const getUserRole = async () => {
      try {
        const response = await fetchUserProfile();
        setUserRole(response.data.role);
        if (response.data.role !== 'ENGINEER') {
          // Fetch users data if role is not ENGINEER
          const usersResponse = await fetchUsers();
          setEngineers(usersResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch user role or users:", error);
      }
    };

    getUserRole();
  }, []);

  useEffect(() => {
    if (report) {
      setName(report.taskName);
      setDate(new Date(report.executeAt).toISOString().split('T')[0]);
      setTime(new Date(report.executeAt).toISOString().split('T')[1].slice(0, 5));
      setEngineer(report.engineerName);
      setCategory(report.taskName);
      setProvince(report.location.split(', ')[1]);
      setCity(report.location.split(', ')[0]);
      setDescription(report.activity);
    }
  }, [report]);

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    setCity("");

    // Fetch cities data based on selected province
    try {
      const response = await fetchCities(selectedProvince);
      setCities(response.data);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!report && !engineers.find((eng) => eng.name === engineer)) {
      setAlertMessage("Please select a valid engineer from the list.");
      return;
    }

    setConfirmMessage("Are you sure you want to create this schedule?");
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setConfirmMessage("");

    const executeAt = toUTC(new Date(`${date}T${time}:00`));
    const engineerId = report ? report.engineerId : engineers.find((eng) => eng.name === engineer)?.id;
    const location = `${cities.find((c) => c.id === city)?.name}, ${provinces.find((p) => p.id === province)?.name}`;
    const activity = description || "No additional details provided";
    const phoneNumber = "647438834423"; // Static phone number

    const scheduleData = {
      taskName: category,
      executeAt,
      engineerId,
      location,
      activity,
      phoneNumber,
    };

    console.log("Schedule Data:", scheduleData); // Debugging line

    try {
      if (report) {
        await cancelSchedule(report.id);
      }
      await createSchedule(scheduleData);
      setNotification({ message: "Schedule created successfully!", type: "success" });
      onClose();
    } catch (error) {
      console.error("Failed to create schedule:", error);
      setNotification({ message: "Failed to create schedule. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEngineers = engineers.filter((eng) =>
    eng.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {isLoading && <LoadingOverlay />}
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage("")} />}
      {confirmMessage && (
        <ConfirmDialog
          message={confirmMessage}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmMessage("")}
        />
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
          <div className="mb-4">
            <label className="block text-gray-700">Service Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              disabled
              required
            >
              <option value="" disabled>Select a category</option>
              <option value="Billed Service/Repair">Billed Service/Repair</option>
              <option value="Service Contract">Service Contract</option>
              <option value="Warranty Installation">Warranty Installation</option>
              <option value="Training">Training</option>
              <option value="Service Visit">Service Visit</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Engineer</label>
            <input
              type="text"
              value={engineer}
              className="w-full px-3 py-2 border rounded"
              disabled
            />
          </div>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700">Province</label>
              <input
                type="text"
                value={province}
                className="w-full px-3 py-2 border rounded"
                disabled
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">City/Kabupaten</label>
              <input
                type="text"
                value={city}
                className="w-full px-3 py-2 border rounded"
                disabled
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleModal;
