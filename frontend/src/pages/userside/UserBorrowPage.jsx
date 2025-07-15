import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../../api/api';
import Swal from 'sweetalert2';

const UserBorrowPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [book, setBook] = useState(location.state?.book || null);
  const [borrows, setBorrows] = useState([]);
  const [bookBorrowStatus, setBookBorrowStatus] = useState(null);

  useEffect(() => {
    if (!book && id) {
      fetchBook(id);
    }
    fetchBorrows();
  }, [id]);

  const fetchBook = async (bookId) => {
    try {
      const res = await api.get(`/books/public/books/${bookId}/`);
      setBook(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBorrows = async () => {
    try {
      const res = await api.get('/borrow/user/');
      setBorrows(res.data);

      // find the borrow record for THIS book
      const record = res.data.find((b) => String(b.book_id) === String(id));
      setBookBorrowStatus(record);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBorrow = async () => {
    try {
      await api.post('/borrow/request/', { book: id });
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Borrow request sent!',
        confirmButtonColor: '#10B981',
      });
      fetchBorrows();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Something went wrong.',
      });
    }
  };

  const renderBorrowButton = () => {
    if (!bookBorrowStatus) {
      return (
        <button
          onClick={handleBorrow}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold"
        >
          Request Borrow
        </button>
      );
    } else {
      let text = '';
      let color = '';
      switch (bookBorrowStatus.status) {
        case 'Pending':
          text = 'Requested';
          color = 'bg-yellow-500';
          break;
        case 'Borrowed':
          text = 'Borrowed';
          color = 'bg-blue-500';
          break;
        case 'Returned':
          text = 'Returned';
          color = 'bg-gray-500';
          break;
        default:
          text = 'Requested';
          color = 'bg-yellow-500';
      }
      return (
        <button
          disabled
          className={`mt-4 ${color} text-white px-4 py-2 rounded text-sm font-semibold cursor-not-allowed`}
        >
          {text}
        </button>
      );
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Borrow Book</h2>

      {book && (
        <div className="border rounded p-4 mb-6">
          {book.image && (
            <img
              src={book.image}
              alt={book.title}
              className="w-full max-w-xs mb-4 rounded"
            />
          )}
          <h3 className="text-xl font-semibold">{book.title}</h3>
          <p className="text-gray-700"><strong>Author:</strong> {book.author}</p>
          <p className="text-gray-700"><strong>Available Copies:</strong> {book.available_copies}</p>
          <p className="text-gray-700"><strong>Category:</strong> {book.category?.name}</p>
          <p className="text-gray-700"><strong>Times Read:</strong> {book.times_read}</p>

          {renderBorrowButton()}
        </div>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">My Borrow Requests</h2>
      {borrows.length === 0 ? (
        <p className="text-gray-500">No borrow requests yet.</p>
      ) : (
        borrows.map((b) => (
          <div key={b.id} className="border p-4 my-2 rounded">
            <p className="text-gray-900 font-medium">{b.book_title}</p>
            <p className="text-gray-700 text-sm">Author: {b.book_author}</p>
            <p className="text-gray-700 text-sm">Status: {b.status}</p>
            <p className="text-gray-700 text-sm">
              Borrow Date: {b.borrow_date || 'N/A'}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default UserBorrowPage;
