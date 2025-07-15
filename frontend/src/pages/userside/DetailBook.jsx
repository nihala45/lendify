import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/userside/Navbar';
import Footer from '../../components/userside/Footer';
import api from '../../api/api';
import Swal from 'sweetalert2';

const DetailBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [borrowStatus, setBorrowStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/books/detail/${id}/`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBorrowStatus = async () => {
      try {
        const res = await api.get(`/books/borrow/status/${id}/`);
        setBorrowStatus(res.data.status);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBook();
    fetchBorrowStatus();
  }, [id]);

  const handleBorrow = async () => {
    const confirmed = await Swal.fire({
      title: 'Confirm Borrow',
      text: 'Do you want to borrow this book?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (confirmed.isConfirmed) {
      try {
        setLoading(true);
        const res = await api.post(`/books/borrow/status/${id}/`);
        setBorrowStatus(res.data.status);
        Swal.fire('Success', 'Borrow request submitted.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Could not borrow the book.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReturnRequest = async () => {
    const confirmed = await Swal.fire({
      title: 'Confirm Return',
      text: 'Do you want to request return?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (confirmed.isConfirmed) {
      try {
        setLoading(true);
        const res = await api.patch(`/books/borrow/status/${id}/`, {
          status: 'return_requested',
        });
        setBorrowStatus(res.data.status);
        Swal.fire('Requested', 'Return request sent.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to request return.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderButton = () => {
    if (loading) {
      return (
        <button className="bg-purple-500 text-white px-6 py-3 rounded-lg opacity-50 cursor-not-allowed">
          Processing...
        </button>
      );
    }

    switch (borrowStatus) {
      case 'pending':
        return (
          <button
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg cursor-not-allowed"
            disabled
          >
            Pending Request
          </button>
        );
      case 'delivered':
        return (
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition duration-300"
            onClick={handleReturnRequest}
          >
            Request Return
          </button>
        );
      case 'return_requested':
        return (
          <button
            className="bg-gray-500 text-white px-6 py-3 rounded-lg cursor-not-allowed"
            disabled
          >
            Return Requested
          </button>
        );
      case 'returned':
        return (
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-lg cursor-not-allowed"
            disabled
          >
            Returned
          </button>
        );
      case 'available':
      default:
        return (
          <button
            className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg transition duration-300"
            onClick={handleBorrow}
          >
            Borrow
          </button>
        );
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 flex justify-center">
        {book ? (
          <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
            {book.image && (
              <div className="md:w-1/2">
                <img
                  src={book.image}
                  alt={book.title}
                  className="object-cover w-full h-80 md:h-full"
                />
              </div>
            )}
            <div className="p-8 md:w-1/2 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-purple-700 mb-4">
                  {book.title}
                </h2>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Author:</span> {book.author}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Times Read:</span> {book.times_read}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Available Copies:</span> {book.available_copies}
                </p>
                <p className="text-gray-700 mb-4">{book.description}</p>
              </div>
              <div className="mt-6">{renderButton()}</div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading book details...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DetailBook;
