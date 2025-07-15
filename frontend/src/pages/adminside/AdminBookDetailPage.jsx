import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminBookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await api.get(`books/admin/${id}/`);
      setBook(response.data);
      setLikes(response.data.likes || 0);
      setComments(response.data.comments || []);
      setRating(response.data.rating || 0);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch book details.");
    }
  };

  const handleLike = async () => {
    try {
      await api.post(`admin/books/${id}/like/`);
      setLikes(likes + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRating = async (star) => {
    try {
      await api.post(`/books/admin/${id}/rate/`, { rating: star });
      setRating(star);
      toast.success(`Rated ${star} star(s)!`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await api.post(`/books/admin/${id}/comment/`, { text: newComment });
      setComments([...comments, { text: newComment }]);
      setNewComment("");
    } catch (error) {
      console.error(error);
    }
  };

  if (!book) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white shadow rounded p-6">
        {/* Image and Info */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <img
              src={book.image_url || "https://via.placeholder.com/300"}
              alt={book.title}
              className="rounded w-full h-80 object-cover"
            />
          </div>
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-1">Author: {book.author}</p>
            <p className="text-gray-600 mb-1">Genre: {book.category_name}</p>
            <p className="text-gray-600 mb-1">
              Available: {book.available_copies} / {book.total_copies}
            </p>

            {/* Likes and Stars */}
            <div className="flex items-center mt-4 gap-4">
              <button
                onClick={handleLike}
                className="text-red-500 hover:text-red-600"
              >
                ❤️ Like ({likes})
              </button>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`cursor-pointer text-xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>
          <div className="space-y-3 mb-4">
            {comments.length > 0 ? (
              comments.map((cmt, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 p-3 rounded text-sm text-gray-700"
                >
                  {cmt.text}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none"
            />
            <button
              onClick={handleAddComment}
              className="bg-purple-700 text-white px-4 rounded hover:bg-purple-800 transition"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookDetailPage;
