import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  // If there are no items at all, we can hide everything (or return a generic empty message)
  if (totalItems === 0) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    // Removed mt-6 and added w-full flex-1 to behave inside the Teachers.jsx flex container
    <div className="flex flex-col md:flex-row flex-1 items-center justify-between gap-4 w-full ml-0 md:ml-6">
      
      {/* Informational Text */}
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{totalItems}</span> entries
      </div>

      {/* Only render the navigation buttons if there is more than 1 page */}
      {totalPages > 1 && (
        <nav>
          <ul className="flex items-center gap-1">
            <li>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Previous"
              >
                <HiChevronLeft className="w-5 h-5" />
              </button>
            </li>
            
            {pageNumbers.map(number => (
              <li key={number}>
                <button
                  onClick={() => onPageChange(number)}
                  className={`px-3 py-1 border rounded transition ${
                    currentPage === number 
                      ? 'bg-blue-50 border-blue-300 text-blue-600 font-semibold' 
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Next"
              >
                <HiChevronRight className="w-5 h-5" />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Pagination;