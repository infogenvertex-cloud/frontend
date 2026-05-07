export default function Pagination({ currentPage, totalPages, onPageChange, className = "" }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7; // Maximum number of page buttons to show
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl p-4 sm:p-6 mt-6 ${className}`} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
      {/* Page Info */}
      <div className="text-sm text-gray-600 order-2 sm:order-1">
        Page <span className="font-semibold" style={{ color: "#1565c0" }}>{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 order-1 sm:order-2 flex-wrap justify-center">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          style={{
            background: currentPage === 1 ? "#f0f4f8" : "#1565c0",
            color: currentPage === 1 ? "#94a3b8" : "#ffffff",
            border: "1px solid #d0d7e0"
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 sm:gap-2">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 hover:scale-105"
                style={{
                  background: isActive ? "#1565c0" : "#f0f4f8",
                  color: isActive ? "#ffffff" : "#64748b",
                  border: isActive ? "2px solid #1565c0" : "1px solid #d0d7e0",
                  fontWeight: isActive ? "bold" : "normal",
                }}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          style={{
            background: currentPage === totalPages ? "#f0f4f8" : "#1565c0",
            color: currentPage === totalPages ? "#94a3b8" : "#ffffff",
            border: "1px solid #d0d7e0"
          }}
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
