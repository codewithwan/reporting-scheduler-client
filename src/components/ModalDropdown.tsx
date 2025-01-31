import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalDropdownProps {
  label: string;
  options: string[];
  onSelect: (selected: string) => void;
}

const ModalDropdown: React.FC<ModalDropdownProps> = ({
  label,
  options,
  onSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionClick = (option: string) => {
    setSelectedValue(option); // Update the input value
    onSelect(option); // Notify parent component
    setIsModalOpen(false); // Close modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700">{label}</label>
      <div className="grid grid-cols-10 space-x-2">
        <input
          type="text"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)} // Allow manual input
          className="col-span-7 w-full px-3 py-2 border rounded"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className="col-span-3 text-xs md:text-sm text-center py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          +Add {label}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal} // Close modal when clicking outside
        >
          <div
            className="bg-white w-[500px] max-w-xl p-6 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Select {label}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl p-1 text-gray-500 rounded hover:bg-gray-200"
              >
                <FaTimes />
              </button>
            </div>
            <input
              type="text"
              placeholder={`Search ${label}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded"
            />
            <ul className="max-h-40 overflow-y-auto">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200 rounded"
                >
                  {option}
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className="px-4 py-2 text-gray-500">No options found</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalDropdown;
