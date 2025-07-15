import React, { useEffect, useState } from "react";
import Navbar from "../../components/userside/Navbar";
import Footer from "../../components/userside/Footer";
import api from "../../api/api";
import Swal from "sweetalert2";

const BorrowBookDetails = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMap, setStatusMap] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBorrows = async () => {
      if (!user || !user.id) {
        console.log("No user found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/books/borrow/user/", {
          params: { user_id: user.id },
        });
        setBorrows(res.data);
        console.log(res.data, 'hey this is the res.data')

        for (let item of res.data) {
          console.log("Fetching status for book id:", item.book_id);
          await fetchBorrowStatus(item.book_id);
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load borrowed books.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, []);


  const fetchBorrowStatus = async (bookId) => {
    try {
      const res = await api.get(`/books/borrow/status/${bookId}/`);
      setStatusMap((prev) => ({
        ...prev,
        [bookId]: res.data.status,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const requestReturn = async (bookId) => {
    const confirm = await Swal.fire({
      title: "Request Return?",
      text: "Do you want to request return of this book?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, request",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.patch(`/books/borrow/status/${bookId}/`, {
        status: "return_requested",
      });
      await fetchBorrowStatus(bookId);
      Swal.fire("Requested!", "Return request sent.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to request return.", "error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          {user ? `${user.username}'s Borrowed Books` : "My Borrowed Books"}
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : borrows.length === 0 ? (
          <p className="text-center text-gray-600">
            You haven’t borrowed any books yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead className="bg-purple-700 text-white">
                <tr>
                  <th className="py-3 px-6 text-left">Book Title</th>
                  <th className="py-3 px-6 text-left">Borrow Date</th>
                  <th className="py-3 px-6 text-left">Delivered Date</th>
                  <th className="py-3 px-6 text-left">Return Date</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((item) => {
                  const status = statusMap[item.book] || item.status;

                  return (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-6">{item.book_title}</td>
                      <td className="py-3 px-6">{item.borrow_date || "—"}</td>
                      <td className="py-3 px-6">{item.delivered_date || "—"}</td>
                      <td className="py-3 px-6">{item.return_date || "—"}</td>
                      <td className="py-3 px-6 capitalize">{status}</td>
                      <td className="py-3 px-6">
                        {status === "delivered" && (
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            onClick={() => requestReturn(item.book_id)}
                          >
                            Request Return
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BorrowBookDetails;
