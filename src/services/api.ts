import axios from "axios";
import { toUTC } from "../utils/dateUtils";

// API Configuration
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `API Error ${error.response.status}: ${error.response.config.url}`,
        error.response.data
      );

      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("token");
        window.dispatchEvent(
          new CustomEvent("showNotification", {
            detail: {
              message: "You do not have permission to access this resource.",
              type: "error",
            },
          })
        );
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const register = (email: string, password: string, name: string) =>
  api.post("/auth/register", { email, password, name });

// User Services
export const fetchUserProfile = () => api.get("/users/me");

export const fetchUsers = () => api.get("/protected/users");

export const updateUser = async (
  id: string,
  user: { name: string; email: string; role: string; signature: string }
) => {
  try {
    const response = await api.put(`/protected/users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/protected/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

// Signature Services
export const saveSignature = async (signatureData: string) => {
  try {
    const response = await api.put("/users/signature", {
      signature: signatureData,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving signature:", error);
    throw error;
  }
};

// Customer Services
export const fetchCustomers = () => api.get("/customers");

export const getCustomerById = async (id: string) => {
  try {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    throw error;
  }
};

export const createCustomer = async (customer: {
  name: string;
  company: string;
  position: string;
  email: string;
  phoneNumber: string;
  address: string;
}) => {
  try {
    const response = await api.post(`/customers`, customer);
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const updateCustomer = async (
  id: string,
  customer: {
    name: string;
    company: string;
    position: string;
    email: string;
    phoneNumber: string;
    address: string;
  }
) => {
  try {
    const response = await api.put(`/customers/${id}`, customer);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error);
    throw error;
  }
};

export const deleteCustomer = async (id: string) => {
  try {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer ${id}:`, error);
    throw error;
  }
};

// Product Services
export const fetchProducts = () => api.get("/products");

export const getProductById = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (product: {
  customerId: string;
  serialNumber: string;
  description: string;
  brand: string;
  model: string;
}) => {
  try {
    const response = await api.post(`/products`, product);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  product: {
    customerId: string;
    serialNumber: string;
    description: string;
    brand: string;
    model: string;
  }
) => {
  try {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

// Location Services
export const fetchProvinces = () =>
  axios.get("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");

export const fetchCities = (provinceId: string) =>
  axios.get(
    `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
  );

// Schedule Services
export const fetchSchedules = () => api.get("/schedules");

export const createSchedule = (scheduleData: any) =>
  api.post("/schedules", {
    ...scheduleData,
    start_date: toUTC(new Date(scheduleData.startDate)),
    end_date: toUTC(new Date(scheduleData.endDate)),
  });

export const updateScheduleStatus = (id: string, status: string) =>
  api.patch(`/schedules/${id}/status`, { status });

export const cancelSchedule = (id: string) =>
  api.patch(`/schedules/${id}/status`, { status: "CANCELED" });

export default api;
