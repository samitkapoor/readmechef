interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

const Pagination = ({ currentPage, totalPages, onPageChange, loading }: PaginationProps) => {
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-amber-500 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ←
      </button>
      {renderPaginationButtons()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
