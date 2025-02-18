import React from "react";

interface CreateButtonProps {
  userRole: string;
  onClick: () => void;
}

const CreateButton: React.FC<CreateButtonProps> = ({ userRole, onClick }) => {
  if (userRole === "ENGINEER") return null;

  return (
    <div className="sm:col-span-1 col-span-2 flex items-center sm:rounded-lg rounded-md shadow-md">
      <button
        onClick={onClick}
        className="bg-purple-600 text-white font-medium w-full h-[calc(100%)] text-md sm:rounded-lg rounded-md shadow-md hover:bg-purple-700 transition-all duration-200"
      >
        + Create
      </button>
    </div>
  );
};

export default CreateButton;
