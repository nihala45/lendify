import React, { useEffect, useState } from "react";
import api from "../../api/api";
import Navbar from "../../components/userside/Navbar";
import Footer from "../../components/userside/Footer";

const BookRecommended = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get("/books/recommendations/", {
          params: { user_id: user.id },
        });
        setBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?.id) {
      fetchRecommendations();
    }
  }, [user]);

  return (
    <>

      <div className="container mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
          Recommended Books for You
        </h2>

        {books.length === 0 ? (
          <p className="text-center text-gray-500">No recommendations yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="border rounded p-4 shadow hover:shadow-lg transition"
              >
                {book.image && (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-48 w-full object-cover mb-3 rounded"
                  />
                )}
                <h3 className="text-xl font-semibold text-purple-700">
                  {book.title}
                </h3>
                <p className="text-gray-700 mb-1">Author: {book.author}</p>
                <p className="text-gray-500 text-sm">
                  Genre: {book.category_name}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Popularity: {book.popularity}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
  
    </>
  );
};

export default BookRecommended;
