import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 mt-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
        
          <div>
            <div className="flex items-center space-x-2 mb-4">
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
              <span className="text-xl font-bold text-purple-700">
                Lender
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Lender is your digital library platform. Borrow, return, and
              discover books easily. Personalized recommendations help you find
              your next favorite read!
            </p>
          </div>

 
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-purple-700 transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-purple-700 transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-purple-700 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-purple-700 transition-colors duration-300"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

        
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase mb-4">
              Get in Touch
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              Email: support@lender.com
            </p>
            <p className="text-gray-600 text-sm">
              Empowering readers and lenders through technology.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Lender. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
