import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import LoadingOverlay from "../components/LoadingOverlay";
import { fetchUserProfile, fetchUsers } from "../services/api";
import CreateButton from "../components/CreateButton";
import SearchBar from "../components/SearchBar";
import EngineerForm from "../components/EngineerForm";
import { updateUser, deleteUser } from "../services/api";
import { Engineer } from "../models/Engineer";

const EngineerList = () => {
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [filteredEngineers, setFilteredEngineers] = useState<Engineer[]>([]);
  // const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEngineer, setCurrentEngineer] = useState<Engineer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState<"create" | "update">("create");
  const [userRole, setUserRole] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [minHeight, setMinHeight] = useState("525px");

  useEffect(() => {
    const updateLayout = () => {
      const screenHeight = window.innerHeight;
      const availableHeight =
        screenHeight - (260);

      const calculatedItems = Math.floor(availableHeight / 75);
      setItemsPerPage(calculatedItems > 0 ? calculatedItems : 1);

      const calculatedMinHeight = calculatedItems * 75;
      setMinHeight(`${calculatedMinHeight}px`);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [userProfile, users] = await Promise.all([
        fetchUserProfile(),
        fetchUsers(),
      ]);

      setUserRole(userProfile.data.role);
      if (Array.isArray(users.data)) {
        const engineerList = users.data.filter(
          (eng: { role: string }) => eng.role === "ENGINEER"
        );
        setEngineers(engineerList);
        setFilteredEngineers(engineerList);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    setFilteredEngineers(
      engineers.filter(
        (engineer) =>
          engineer.name.toLowerCase().includes(lowercasedSearchTerm) ||
          engineer.email.toLowerCase().includes(lowercasedSearchTerm)
      )
    );
  };

  const handleUpdate = async (updatedEngineer: Engineer) => {
    if (!updatedEngineer.id) return;
    try {
      await updateUser(updatedEngineer.id, updatedEngineer);
      refreshData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating engineer:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentEngineer?.id) return;
    try {
      await deleteUser(currentEngineer.id);
      refreshData();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting engineer:", error);
    }
  };

  // const handleDetail = (engineer: Engineer) => {
  //   setCurrentEngineer(engineer);
  //   setIsDetailOpen(true);
  // };

  const openModal = (
    type: "create" | "update",
    engineer: Engineer | null = null
  ) => {
    setModalType(type);
    setSelectedEngineer(engineer);
    setIsModalOpen(true);
  };

  const openDeleteModal = (engineer: Engineer) => {
    setCurrentEngineer(engineer);
    setIsDeleteOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEngineers = filteredEngineers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage);

  return (
    <MainLayout>
      {isLoading && <LoadingOverlay />}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 grid gap-4">
        <div className="grid grid-cols-6 gap-4 h-15 items-stretch">
          <SearchBar onSearch={handleSearch} />
          <CreateButton
            userRole={userRole}
            onClick={() => openModal("create")}
          />
        </div>

        {/* engineer List Table */}
        <div
          style={{ minHeight }}
          className="hidden sm:block"
        >
          <div className="md:bg-white bg-none md:shadow-md shadow-none rounded-md overflow-hidden">
            <table className="min-w-full table-auto border-collapse border border-gray-200 hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/4 px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                    NAME
                  </th>
                  <th className="w-1/4 px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                    EMAIL
                  </th>
                  <th className="w-1/4 px-6 py-3 text-left text-xs font-large text-gray-500 uppercase border-b">
                    ADDRESS
                  </th>
                  <th className="w-1/4 px-6 py-3 text-center text-xs font-large text-gray-500 uppercase border-b text-center">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEngineers.map((engineer) => (
                  <tr key={engineer.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 border-b">
                      {engineer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {engineer.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      Jl. jalan ke pasar pagi
                    </td>
                    <td className="px-6 py-4 text-center border-b space-x-2">
                      <button
                        onClick={() => openModal("update", engineer)}
                        className="px-3 py-2 text-sm font-medium text-blue-800 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => openDeleteModal(engineer)}
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
        </div>

        {/* Pagination Controls */}
        <div className="hidden sm:flex justify-center items-center mt-3 min-h-[40px]">
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-300"
                }`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === page
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Responsive Version */}
        <div className="flex flex-col space-y-4 md:hidden">
          {filteredEngineers.map((engineer) => (
            <div
              key={engineer.id}
              className="bg-white p-4 shadow-md rounded-md"
            >
              <h3 className="text-sm font-medium text-gray-700 mb-2 border-b pb-2">
                {engineer.name}
              </h3>
              <div className="text-sm text-gray-500">
                <p className="flex">
                  <span className="w-1/3 font-bold">EMAIL</span>
                  <span className="w-2/3 font-semibold">
                    : {engineer.email}
                  </span>
                </p>
                <p className="flex">
                  <span className="w-1/3 font-bold">ADDRESS</span>
                  <span className="w-2/3 font-semibold">
                    : Jl. jalan ke pasar sore
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-between gap-x-2 mt-2 border-t pt-3">
                <>
                  {/* <button
                    onClick={() => handleDetail(engineer)}
                    className="w-2/6 py-2 text-sm font-medium text-green-600 bg-green-200 rounded-md hover:text-white hover:bg-green-500"
                  >
                    Detail
                  </button> */}
                  <button
                    onClick={() => openModal("update", engineer)}
                    className="w-2/6 py-2 text-sm font-medium text-blue-600 bg-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => openDeleteModal(engineer)}
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
      <EngineerForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalType={modalType}
        engineer={selectedEngineer}
        onSubmit={handleUpdate}
      />

      {isDeleteOpen && currentEngineer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="mb-4">
              Are you sure you want to delete "{currentEngineer.name}"?
            </h2>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 me-2 rounded"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default EngineerList;
