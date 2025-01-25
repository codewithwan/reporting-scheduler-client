import React from "react";
import { FaFilter, FaRedo, FaChevronDown } from "react-icons/fa";

const FilterSection = () => {
  return (
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
  );
};

export default FilterSection;
