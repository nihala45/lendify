import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleBorrowClick = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate(`/user/book-detail/${book.id}`, { state: { book } });
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className="flex flex-col h-full rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition duration-300 bg-white"
    >
      {book.image && (
        <img
          src={book.image}
          alt={book.title || 'Book image'}
          className="w-full object-cover aspect-video"
        />
      )}

      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          {book.category?.name && (
            <span className="mb-2 inline-block px-3 py-1 bg-primary/10 rounded-full text-primary text-xs">
              {book.category.name}
            </span>
          )}

          <h5 className="mb-2 font-semibold text-gray-900 text-lg break-words">
            {book.title}
          </h5>

          <p className="text-sm text-gray-700">
            <strong>Author:</strong> {book.author}
          </p>
        </div>

        <button
          onClick={handleBorrowClick}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold"
        >
          Borrow Book
        </button>
      </div>
    </div>
  );
};

export default BookCard;
