import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm w-full">
      <div className="flex justify-between items-center px-4 sm:px-8 h-16">
        
        {/* Left side: Logo + App Name */}
        <Link to="/" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-purple-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m0 0c-2.828 0-5.5-1.343-5.5-3V9c0-1.657 2.672-3 5.5-3s5.5 1.343 5.5 3v6c0 1.657-2.672 3-5.5 3z"
            />
          </svg>
          <span className="text-2xl font-bold text-purple-700 tracking-wide">
            Lendify
          </span>
        </Link>

        {/* Right side: Login */}
        <Link
          to="/login"
          className="inline-block px-5 py-2 border border-purple-700 text-purple-700 rounded-md hover:bg-purple-700 hover:text-white transition-colors duration-300 font-medium"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
