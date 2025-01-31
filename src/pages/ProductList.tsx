import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/api";
import SearchBar from "../components/SearchBar";
import { fetchCustomers } from "../services/api";

interface Product {
  id: string;
  customerId: string;
  serialNumber: string;
  description: string;
  brand: string;
  model: string;
  created_at: string;
  updated_at: string;
}

interface Customer {
  id: string;
  name: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<
    Omit<Product, "id" | "created_at" | "updated_at">
  >({
    customerId: "",
    serialNumber: "",
    description: "",
    brand: "",
    model: "",
  });

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.customerId) newErrors.customerId = "Customer is required";
    if (!formData.serialNumber)
      newErrors.serialNumber = "Serial Number is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.model) newErrors.model = "Model is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = currentProduct
        ? await updateProduct(currentProduct.id, formData)
        : await createProduct(formData);
      console.log("Product saved successfully:", response);
      fetchProductData();
      setIsModalOpen(false);
    } catch (error) {
      console.log("Error saving product:", error);
    }
  };

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const response = await fetchCustomers();
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    getCustomers();
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchProducts();
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (product: Product | null = null) => {
    setCurrentProduct(product);
    setFormData(
      product
        ? { ...product }
        : {
            customerId: "",
            serialNumber: "",
            description: "",
            brand: "",
            model: "",
          }
    );
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetail = (product: Product) => {
    setCurrentProduct(product);
    setIsDetailOpen(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      fetchProductData();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleteOpen(false);
      setProductToDelete(null);
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
              setFilteredProducts(
                products.filter(
                  (p) =>
                    p.customerId.toLowerCase().includes(lowercasedSearchTerm) ||
                    p.serialNumber
                      .toLowerCase()
                      .includes(lowercasedSearchTerm) ||
                    p.description
                      .toLowerCase()
                      .includes(lowercasedSearchTerm) ||
                    p.brand.toLowerCase().includes(lowercasedSearchTerm) ||
                    p.model.toLowerCase().includes(lowercasedSearchTerm)
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
                  CUSTOMER
                </th>
                <th className="w-1/5 px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                  SERIAL NUMBER
                </th>
                <th className="w-1/5 px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                  BRAND
                </th>
                <th className="w-1/5 px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                  MODEL
                </th>
                <th className="w-1/5 px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b text-center">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="w-1/5 px-6 py-4 text-sm font-medium text-gray-700 border-b">
                    {customers.find(
                      (customer) => customer.id === product.customerId
                    )?.name || "Unknown"}
                  </td>
                  <td className="w-1/5 px-6 py-4 text-sm text-gray-700 border-b">
                    {product.serialNumber}
                  </td>
                  <td className="w-1/5 px-6 py-4 text-sm text-gray-700 border-b">
                    {product.brand}
                  </td>
                  <td className="w-1/5 px-6 py-4 text-sm text-gray-700 border-b">
                    {product.model}
                  </td>
                  <td className="w-1/5 py-4 text-center border-b space-x-2">
                    <button
                      onClick={() => handleDetail(product)}
                      className="px-3 py-2 text-sm font-medium text-green-800 bg-green-200 rounded-md hover:text-white hover:bg-green-500"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="px-3 py-2 text-sm font-medium text-blue-800 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
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
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 shadow-md rounded-md">
              <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-2">
                {customers.find(
                  (customer) => customer.id === product.customerId
                )?.name || "Unknown"}
              </h3>
              <div className="text-sm text-gray-500">
                <p className="flex">
                  <span className="w-1/3 font-semibold">SERIAL NUMBER</span>
                  <span className="w-2/3 font-semibold">
                    : {product.serialNumber}
                  </span>
                </p>
                <p className="flex">
                  <span className="w-1/3 font-semibold">BRAND</span>
                  <span className="w-2/3 font-semibold">: {product.brand}</span>
                </p>
              </div>
              <div className="flex items-center justify-between gap-x-2 mt-2 border-t pt-3">
                <>
                  <button
                    onClick={() => handleDetail(product)}
                    className="w-2/6 py-2 text-sm font-medium text-green-600 bg-green-200 rounded-md hover:text-white hover:bg-green-500"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="w-2/6 py-2 text-sm font-medium text-blue-600 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
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
              {currentProduct ? "Edit Product" : "Create Product"}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Dropdown untuk Customer */}
              <div className="mb-4">
                <label className="block text-gray-700">Customer</label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <p className="text-red-500 text-sm">{errors.customerId}</p>
                )}
              </div>

              {/* Input lainnya */}
              {[
                { label: "Serial Number", name: "serialNumber" },
                { label: "Brand", name: "brand" },
                { label: "Model", name: "model" },
                { label: "Description", name: "description" },
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

      {isDetailOpen && currentProduct && (
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
              Product Details
            </h2>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Customer</strong>:{" "}
              {customers.find(
                (customer) => customer.id === currentProduct?.customerId
              )?.name || "Unknown"}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Serial Number</strong>:{" "}
              {currentProduct.serialNumber}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Brand</strong>:{" "}
              {currentProduct.brand}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Model</strong>:{" "}
              {currentProduct.model}
            </p>
            <p className="flex">
              <strong className="w-1/3 text-gray-700">Description</strong>{" "}
              <span className="w-2/3">: {currentProduct.description}</span>
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
      {isDeleteOpen && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Are you sure you want to delete <br></br>"{productToDelete.brand}
              "?
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

export default ProductList;
