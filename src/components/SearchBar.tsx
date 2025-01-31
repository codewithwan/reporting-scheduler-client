import { useState } from "react";
import { FaSearch } from "react-icons/fa";

type SearchBarProps = {
  onSearch: (searchTerm: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value); // Panggil fungsi pencarian saat input berubah
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="sm:col-span-5 col-span-4 text-lg bg-gray-100 flex items-center border-2 border-purple-700 rounded-md shadow-md p-2">
      {/* Input Search */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full px-4 bg-transparent text-gray-700 focus:outline-none"
      />

      {/* Icon Search */}
      <span
        onClick={handleSearch}
        className="flex items-center justify-center px-4 py-2 text-purple-700 cursor-pointer"
      >
        <FaSearch />
      </span>
    </div>
  );
};

export default SearchBar;
