import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-1 font-bold">Oops! Page Not Be Found.</p>
      <p className="text-sm">Sorry but the page you are looking for does not exist,</p>
      <p className="text-sm">have been removed, name changed temporarily</p>
      <p className="text-sm mb-6">unavailable</p>
      <Link to="/" className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700">
        Go To Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
