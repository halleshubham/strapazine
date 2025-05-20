import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { PaginationData } from '../../types';

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { page, pageCount } = pagination;
  
  // Generate array of visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Logic to show pages around the current page
    if (pageCount <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (page <= 3) {
        // If current page is at the beginning
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(pageCount);
      } else if (page >= pageCount - 2) {
        // If current page is at the end
        pages.push(1);
        pages.push('ellipsis');
        for (let i = pageCount - 3; i <= pageCount; i++) {
          pages.push(i);
        }
      } else {
        // If current page is in the middle
        pages.push(1);
        pages.push('ellipsis');
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(pageCount);
      }
    }
    
    return pages;
  };
  
  if (pageCount <= 1) return null;
  
  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex items-center">
        <li>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className={`flex items-center px-3 py-2 rounded-md mr-2 ${
              page === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-magazine-primary hover:bg-magazine-primary hover:text-white'
            }`}
          >
            <ChevronLeftIcon className="h-5 w-5" />
            <span className="sr-only">Previous Page</span>
          </button>
        </li>
        
        {getPageNumbers().map((pageNum, index) => (
          <li key={index}>
            {pageNum === 'ellipsis' ? (
              <span className="px-4 py-2">...</span>
            ) : (
              <button
                onClick={() => onPageChange(pageNum as number)}
                className={`px-4 py-2 rounded-md mx-1 ${
                  page === pageNum
                    ? 'bg-magazine-primary text-white'
                    : 'text-magazine-primary hover:bg-gray-200'
                }`}
              >
                {pageNum}
              </button>
            )}
          </li>
        ))}
        
        <li>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === pageCount}
            className={`flex items-center px-3 py-2 rounded-md ml-2 ${
              page === pageCount
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-magazine-primary hover:bg-magazine-primary hover:text-white'
            }`}
          >
            <ChevronRightIcon className="h-5 w-5" />
            <span className="sr-only">Next Page</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
