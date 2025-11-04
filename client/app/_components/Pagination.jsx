import React from "react";


// This component is used to render pagination controls for navigating through pages of data used by admin pages.
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Function to generate an array of page numbers for pagination
  const generatePageNumbers = () => {
    let start = currentPage - 4;
    let end = currentPage + 5;

    if (currentPage <= 5) {
      start = 1;
      end = Math.min(10, totalPages);
    } else if (currentPage >= totalPages - 4) {
      end = totalPages;
      start = Math.max(1, totalPages - 9);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="w-full md:w-[80%] flex items-center justify-between text-gray-500 py-2">
      <button
        className={`py-2 px-4 rounded-md bg-slate-200  text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed 
          ${currentPage === 1 ? "bg-slate-200" : "bg-blue-200"}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      <div className="flex flex-row items-center gap-2 text-sm">
        {generatePageNumbers().map((page) => (
          <button
            key={page}
            className={`px-2 py-2 rounded-sm cursor-pointer ${
              currentPage === page ? "bg-blue-200" : "bg-blue-50"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className={`py-2 px-4 rounded-md text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          currentPage >= totalPages ? "bg-slate-200" : "bg-blue-200"
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages }
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
