import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getIssues } from '../services/api';
import Pagination from '../components/Common/Pagination';
import type { Issue, PaginationData } from '../types';

const IssuesPage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    pageSize: 12,
    pageCount: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getIssues(page, 12);
      setIssues(response.data);
      setPagination(response.meta.pagination);
    } catch (err) {
      setError('Failed to load issues. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handlePageChange = (page: number) => {
    fetchIssues(page);
    window.scrollTo(0, 0);
  };

  if (loading && issues.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-magazine-primary"></div>
      </div>
    );
  }

  if (error && issues.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => fetchIssues()} 
          className="mt-4 px-4 py-2 bg-magazine-primary text-white rounded hover:bg-magazine-secondary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-magazine-primary mb-4">
          Magazine Issues
        </h1>
        <p className="text-gray-600">
          Browse all issues of our weekly magazine
        </p>
      </header>

      {issues.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-xl text-gray-600">No issues found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => {
              const imageUrl = issue.coverImage?.url
                ? `http://localhost:1337${issue.coverImage.url}`
                : 'https://via.placeholder.com/600x800?text=Issue+Cover';
              
              return (
                <Link 
                  key={issue.id} 
                  to={`/issue/${issue.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
                >
                  <div className="relative aspect-[3/4]">
                    <img
                      src={imageUrl}
                      alt={issue.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="bg-magazine-secondary px-2 py-1 rounded inline-block text-sm font-bold mb-2">
                        Issue #{issue.issueNumber}
                      </div>
                      <h2 className="font-serif text-2xl font-bold">{issue.title}</h2>
                      <p className="mt-2 text-gray-200">
                        {format(new Date(issue.publishDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default IssuesPage;
