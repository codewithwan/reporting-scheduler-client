import React, { useState, useEffect } from "react";
import {
  fetchProvinces,
  fetchUsers,
  createSchedule,
  fetchUserProfile,
  cancelSchedule,
  fetchCustomers,
  fetchProducts,
} from "../services/api";
import { toUTC } from "../utils/dateUtils";
import Alert from "./Alert";
import ConfirmDialog from "./ConfirmDialog";
import LoadingOverlay from "./LoadingOverlay";
import Notification from "./Notification";
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
  const [, setName] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [engineer, setEngineer] = useState("");
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [engineers, setEngineers] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>(
    []
  );
  const [products, setProducts] = useState<
    { id: string; brand: string; model: string }[]
  >([]);
  const [] = useState("");
  const [] = useState(false);
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    []
  );
  const [cities] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [, setUserRole] = useState("");

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

    // Fetch customers data
    const getCustomers = async () => {
      try {
        const response = await fetchCustomers();
        setCustomers(response.data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };

    getCustomers();

    // Fetch products data
    const getProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    getProducts();

    // Fetch user role
    const getUserRole = async () => {
      try {
        const response = await fetchUserProfile();
        setUserRole(response.data.role);
        if (response.data.role !== "ENGINEER") {
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
      setStartDate(new Date(report.startDate).toISOString().split("T")[0]);
      setEndDate(new Date(report.endDate).toISOString().split("T")[0]);
      setEngineer(report.engineerName);
      setCustomer(report.customer_id);
      setProduct(report.product_id);
      setCategory(report.taskName);
      setProvince(report.location?.split(", ")[1] || "");
      setCity(report.location?.split(", ")[0] || "");
      setDescription(report.activity || "");
    }
  }, [report]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!engineers.find((eng) => eng.name === engineer)) {
      setAlertMessage("Please select a valid engineer from the list.");
      return;
    } else if (!customers.find((eng) => eng.name === customer)) {
      setAlertMessage("Please select a valid customer from the list.");
      return;
    } else if (!products.find((eng) => eng.brand === product)) {
      setAlertMessage("Please select a valid product from the list.");
      return;
    }

    setConfirmMessage("Are you sure you want to create this schedule?");
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setConfirmMessage("");

    try {
      const engineerId = report
        ? report.engineer_id
        : engineers.find((eng) => eng.name === engineer)?.id;

      if (!engineerId) {
        throw new Error("Engineer ID not found.");
      }

      const customerId = report
        ? report.customer_id
        : customers.find((eng) => eng.name === customer)?.id;

      if (!customerId) {
        throw new Error("Customer ID not found.");
      }

      const productId = report
        ? report.product_id
        : products.find((eng) => eng.brand === product)?.id;

      if (!productId) {
        throw new Error("Product ID not found.");
      }

      const startDate = toUTC(new Date(`${start_date}T12:00:00`));
      const endDate = toUTC(new Date(`${end_date}T12:00:00`));

      const location = `${city}, ${province}`;
      const activity = description || "No additional details provided";
      const phoneNumber = "647438834423"; // Static phone number

      const scheduleData = {
        taskName: category,
        startDate,
        endDate,
        engineerId,
        customerId,
        productId,
        location,
        activity,
        phoneNumber,
      };

      if (report) {
        await cancelSchedule(report.id);
      }

      await createSchedule(scheduleData);
      window.location.reload();

      setNotification({
        message: "Schedule created successfully!",
        type: "success",
      });

      onClose();
    } catch (error) {
      console.error("Failed to create schedule:", error);
      setNotification({
        message: "Failed to create schedule. Please try again.",
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
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Billed Service/Repair">
                Billed Service/Repair
              </option>
              <option value="Service Contract">Service Contract</option>
              <option value="Warranty Installation">
                Warranty Installation
              </option>
              <option value="Training">Training</option>
              <option value="Service Visit">Service Visit</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Engineer</label>
            <select
              value={engineer}
              onChange={(e) => setEngineer(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="" disabled>
                Select an engineer
              </option>
              {engineers.map((engineer) => (
                <option key={engineer.id} value={engineer.name}>
                  {engineer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Customer</label>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.name}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Product</label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="" disabled>
                Select a product
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.brand}>
                  {product.brand}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700">Start Date</label>
              <input
                type="date"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">End Date</label>
              <input
                type="date"
                value={end_date}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>
          {/* <div className="mb-4 flex space-x-4">
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
          </div> */}
          <div className="mb-4">
            <label className="block text-gray-700">Activity</label>
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
