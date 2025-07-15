import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBook = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [totalCopies, setTotalCopies] = useState(1);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/adminside/categories/");
      let data = response.data;

      
      if (data.results) {
        data = data.results;
      }

      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error(error);
      setCategories([]);
      toast.error("Failed to load categories.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !author || !category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("category", category);
      formData.append("total_copies", totalCopies);
      formData.append("available_copies", totalCopies);

      if (image) {
        formData.append("image", image);
      }

      await api.post("/books/admin/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Book added successfully!");
      navigate("/admin/manage-books");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <ToastContainer />
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Book</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
       
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
            />
          </div>

    
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
            />
          </div>

    
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
            >
              <option value="">Select a genre</option>
              {Array.isArray(categories) &&
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Copies
            </label>
            <input
              type="number"
              min="1"
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
            />
          </div>

        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-gray-700"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 text-white py-3 rounded hover:bg-purple-800 transition"
            >
              {loading ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
