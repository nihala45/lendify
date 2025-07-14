import React from "react";

const Header = () => {
  return (
    <div className="relative overflow-hidden bg-gray-900 w-full">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
        }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gray-900 opacity-50"></div>

      {/* Header content */}
      <div className="relative z-10 px-4 sm:px-8 py-16 sm:py-24 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white">
          Welcome to{" "}
          <span className="text-purple-400">Happy Clicks Library</span>
        </h1>

        <p className="mt-4 sm:mt-6 max-w-4xl mx-auto text-gray-200 text-base sm:text-lg md:text-xl">
          Browse, borrow, and discover your next favorite book. Your personal
          book lending and recommendation system, powered by Django and React.
        </p>

        <div className="mt-8 flex justify-center flex-wrap gap-4">
          <a
            href="#browse-books"
            className="inline-block px-6 py-3 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 transition-colors duration-300"
          >
            Browse Books
          </a>
          <a
            href="#login"
            className="inline-block px-6 py-3 border border-purple-400 text-purple-400 font-semibold rounded-md hover:bg-purple-700 hover:text-white transition-colors duration-300"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
