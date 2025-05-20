import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getArticlesByIssue } from '../services/api';
import ArticleGrid from '../components/Articles/ArticleGrid';
import Pagination from '../components/Common/Pagination';
import { Article, Issue, PaginationData } from '../types';

const IssuePage = () => {
  const { id } = useParams<{ id: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [issueDetails, setIssueDetails] = useState<Issue | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    pageSize: 9,
    pageCount: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async (page = 1) => {
    try {
      setLoading(true);
      if (!id) throw new Error('Issue ID is missing');
      
      const response = await getArticlesByIssue(parseInt(id), page, 9);
      setArticles(response.data);
      setPagination(response.meta.pagination);
      
      // Get issue details from the first article if available
      if (response.data.length > 0 && response.data[0].issue) {
        setIssueDetails(response.data[0].issue);
      }
    } catch (err) {
      setError('Failed to load articles for this issue.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [id]);

  const handlePageChange = (page: number) => {
    fetchArticles(page);
    window.scrollTo(0, 0);
  };

  if (loading && articles.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-magazine-primary"></div>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => fetchArticles()} 
          className="mt-4 px-4 py-2 bg-magazine-primary text-white rounded hover:bg-magazine-secondary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const issueImageUrl = issueDetails?.coverImage?.url
    ? `http://localhost:1337${issueDetails.coverImage.url}`
    : 'https://via.placeholder.com/1200x600?text=Issue+Cover';

  return (
    <div>
      {issueDetails && (
        <header className="mb-12">
          <div className="relative">
            <div className="aspect-[21/9] overflow-hidden rounded-xl">
              <img
                src={issueImageUrl}
                alt={issueDetails.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 lg:p-16">
              <div className="text-white max-w-2xl">
                <div className="bg-magazine-secondary inline-block px-3 py-1 rounded text-sm font-bold mb-4">
                  Issue #{issueDetails.issueNumber}
                </div>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {issueDetails.title}
                </h1>
                <p className="text-gray-200 mb-6">
                  Published on {format(new Date(issueDetails.publishDate), 'MMMM d, yyyy')}
                </p>
                <Link
                  to="/issues"
                  className="inline-flex items-center text-white hover:text-magazine-secondary"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to All Issues
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      {articles.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-xl text-gray-600">No articles found in this issue.</p>
        </div>
      ) : (
        <>
          <h2 className="font-serif text-3xl font-bold text-magazine-primary mb-8">
            Articles in {issueDetails ? `"${issueDetails.title}"` : 'This Issue'}
          </h2>
          <ArticleGrid articles={articles} />
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default IssuePage;
