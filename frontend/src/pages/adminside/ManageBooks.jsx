import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const ManageBooks = () => {
  
  const [books, setBooks] = useState([]);
  const [count, setCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const pageSize = 10;

  useEffect(() => {
    fetchBooks(1, "");
  }, []);

  const fetchBooks = async (pageNumber = 1, searchQuery = "") => {
    try {
      const response = await api.get("/books/admin/", {
        params: {
          page: pageNumber,
          page_size: pageSize,
          search: searchQuery,
        },
      });

      setBooks(response.data.results);
      setCount(response.data.count);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
      setPage(pageNumber);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching books");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);
    fetchBooks(1, query);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }
    try {
      await api.delete(`/books/admin/${id}/`);
      toast.success("Book deleted successfully");
      fetchBooks(page, search);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete book");
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      fetchBooks(page - 1, search);
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      fetchBooks(page + 1, search);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Books</h1>
        <Link
          to="/admin/add-book"
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
        >
          Add New Book
        </Link>
      </div>

      <div className="max-w-md mb-6">
        <input
          type="text"
          placeholder="Search by title, author, or genre"
          value={search}
          onChange={handleSearch}
          className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-700"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <Link
              to={`/admin/bookdetail/${book.id}`}
              key={book.id}
              className="bg-white rounded shadow p-4 flex flex-col items-center hover:shadow-lg transition"
            >
              {book.image_url ? (
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded mb-4 text-gray-500">
                  No Image
                </div>
              )}
              <h2 className="text-lg font-bold text-gray-800 mb-1">
                {book.title}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                Author: {book.author}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                Genre: {book.category_name || "-"}
              </p>

              <div className="flex gap-2">
                <Link
                  to={`/admin/edit-book/${book.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(book.id);
                  }}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No books found.
          </p>
        )}
      </div>

      {count > pageSize && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={!prevPage}
            className="flex items-center text-purple-700 hover:underline disabled:text-gray-300"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            Prev
          </button>
          <span className="text-gray-600 text-sm">
            Page {page} of {Math.ceil(count / pageSize)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!nextPage}
            className="flex items-center text-purple-700 hover:underline disabled:text-gray-300"
          >
            Next
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
