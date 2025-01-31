import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/api";
import SearchBar from "../components/SearchBar";

interface Customer {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phoneNumber: string;
  address: string;
  created_at: string;
  updated_at: string;
}

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<
    Omit<Customer, "id" | "created_at" | "updated_at">
  >({
    name: "",
    company: "",
    position: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Nama tidak boleh kosong";
    if (!formData.company) newErrors.company = "Perusahaan tidak boleh kosong";
    if (!formData.email) newErrors.email = "Email tidak boleh kosong";
    if (!formData.phoneNumber || !/^[0-9]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Nomor telepon harus berisi 10-15 digit angka";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = currentCustomer
        ? await updateCustomer(currentCustomer.id, formData)
        : await createCustomer(formData);
      console.log("Customer saved successfully:", response);
      fetchCustomerData();
      setIsModalOpen(false);
    } catch (error) {
      console.log("Error saving customer:", error);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCustomers();
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (customer: Customer | null = null) => {
    setCurrentCustomer(customer);
    setFormData(
      customer
        ? { ...customer }
        : {
            name: "",
            company: "",
            position: "",
            email: "",
            phoneNumber: "",
            address: "",
          }
    );
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetail = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await deleteCustomer(customerToDelete.id);
      fetchCustomerData();
    } catch (error) {
      console.error("Error deleting customer:", error);
    } finally {
      setIsDeleteOpen(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <MainLayout>
      {isLoading && <LoadingOverlay />}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 grid gap-4">
        <div className="grid grid-cols-6 gap-2">
          <SearchBar
            onSearch={(searchTerm) => {
              const lowercasedSearchTerm = searchTerm.toLowerCase();
              setFilteredCustomers(
                customers.filter(
                  (c) =>
                    c.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    c.email.toLowerCase().includes(lowercasedSearchTerm) ||
                    c.company.toLowerCase().includes(lowercasedSearchTerm)
                )
              );
            }}
          />
          <button
            onClick={() => handleOpenModal()}
            className="bg-purple-600 hover:bg-purple-700 sm:col-span-1 col-span-2 text-white px-4 py-2 rounded-md shadow-md"
          >
            + Create
          </button>
        </div>

        <div className="md:bg-white bg-none md:shadow-md shadow-none rounded-md overflow-hidden">
          <table className="min-w-full table-auto border-collapse border border-gray-200 hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/5 px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                  Name
                </th>
                <th className="w-1/5 px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                  Company
                </th>
                <th className="w-1/5 px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                  Position
                </th>
                <th className="w-1/5 px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                  Email
                </th>
                <th className="w-1/5 px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-100">
                  <td className="w-1/5 px-6 py-4 text-sm font-medium text-gray-700 border-b">
                    {customer.name}
                  </td>
                  <td className="w-1/5 px-6 py-4 text-sm text-gray-700 border-b">
                    {customer.company}
                  </td>
                  <td className="w-1/5 px-6 py-4 text-sm text-gray-700 border-b">
                    {customer.position}
                  </td>
                  <td className="w-1/5 px-6 py-4 text-sm text-gray-700 border-b">
                    {customer.email}
                  </td>
                  <td className="w-1/5 py-4 text-center border-b space-x-2">
                    <button
                      onClick={() => handleDetail(customer)}
                      className="px-3 py-2 text-sm font-medium text-green-800 bg-green-200 rounded-md hover:text-white hover:bg-green-500"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handleOpenModal(customer)}
                      className="px-3 py-2 text-sm font-medium text-blue-800 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(customer)}
                      className="px-3 py-2 text-sm font-medium text-red-800 bg-red-200 rounded-md hover:text-white hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col space-y-4 md:hidden">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white p-4 shadow-md rounded-md"
            >
              <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-2">
                {customer.name}
              </h3>
              <div className="text-sm text-gray-500">
                <p className="flex">
                  <span className="w-1/3 font-semibold">EMAIL</span>
                  <span className="w-2/3 font-semibold">
                    : {customer.email}
                  </span>
                </p>
                <p className="flex">
                  <span className="w-1/3 font-semibold">ADDRESS</span>
                  <span className="w-2/3 font-semibold">
                    : Jl. jalan ke pasar sore
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-between gap-x-2 mt-2 border-t pt-3">
                <>
                  <button
                    onClick={() => handleDetail(customer)}
                    className="w-2/6 py-2 text-sm font-medium text-green-600 bg-green-200 rounded-md hover:text-white hover:bg-green-500"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => handleOpenModal(customer)}
                    className="w-2/6 py-2 text-sm font-medium text-blue-600 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(customer)}
                    className="w-2/6 py-2 text-sm font-medium text-red-600 bg-red-200 rounded-md hover:text-white hover:bg-red-500"
                  >
                    Delete
                  </button>
                </>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-md shadow-md w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              {currentCustomer ? "Edit Customer" : "Create Customer"}
            </h2>
            <form onSubmit={handleSubmit}>
              {[
                { label: "Name", name: "name" },
                { label: "Company", name: "company" },
                { label: "Position", name: "position" },
                { label: "Email", name: "email" },
                { label: "Phone Number", name: "phoneNumber" },
                { label: "Address", name: "address" },
              ].map(({ label, name }) => (
                <div className="mb-4" key={name}>
                  <label className="block text-gray-700">{label}</label>
                  <input
                    name={name}
                    type="text"
                    onChange={handleChange}
                    value={(formData as any)[name]}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                  {errors[name] && (
                    <p className="text-red-500 text-sm">{errors[name]}</p>
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailOpen && currentCustomer && (
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
              Customer Details
            </h2>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Name</strong>:{" "}
              {currentCustomer.name}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Company</strong>:{" "}
              {currentCustomer.company}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Position</strong>:{" "}
              {currentCustomer.position}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Email</strong>:{" "}
              {currentCustomer.email}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Phone</strong>:{" "}
              {currentCustomer.phoneNumber}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Address</strong>:{" "}
              {currentCustomer.address}
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
      {isDeleteOpen && customerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Are you sure you want to delete <br></br>"{customerToDelete.name}"?
            </h2>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default CustomerList;
