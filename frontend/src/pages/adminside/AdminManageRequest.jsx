import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import Swal from 'sweetalert2';

const AdminMangeRequest = () => {
  const [borrows, setBorrows] = useState([]);

  // Fetch borrow records on mount
  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const res = await api.get('/books/admin/borrow/list/');
      setBorrows(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const confirm = await Swal.fire({
        title: 'Confirm Status Change',
        text: `Change status to "${newStatus}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
      });

      if (confirm.isConfirmed) {
        await api.patch(`/books/admin/borrow/update/${id}/`, {
          status: newStatus,
        });
        await fetchBorrows();
        Swal.fire('Updated', 'Status updated successfully.', 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'Could not update status.', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
        Borrow Requests
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left">User Email</th>
              <th className="py-3 px-4 text-left">Book Title</th>
              <th className="py-3 px-4 text-left">Author</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-3 px-4">{item.user_email}</td>
                <td className="py-3 px-4">{item.book_title}</td>
                <td className="py-3 px-4">{item.book_author || 'N/A'}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'return_requested'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 space-x-2">
                  {item.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(item.id, 'delivered')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {item.status === 'return_requested' && (
                    <button
                      onClick={() => updateStatus(item.id, 'returned')}
                      className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-2 rounded text-sm"
                    >
                      Mark Returned
                    </button>
                  )}
                  {(item.status !== 'pending' && item.status !== 'return_requested') && (
                    <span className="text-gray-500 text-sm">No Actions</span>
                  )}
                </td>
              </tr>
            ))}
            {borrows.length === 0 && (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No borrow requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMangeRequest;
