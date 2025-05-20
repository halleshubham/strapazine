import { useState, useEffect } from 'react';
import { getArticles } from '../services/api';
import ArticleGrid from '../components/Articles/ArticleGrid';
import Pagination from '../components/Common/Pagination';
import { Article, PaginationData } from '../types';

const ArchivePage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    pageSize: 12,
    pageCount: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getArticles(page, 12);
      setArticles(response.data);
      setPagination(response.meta.pagination);
    } catch (err) {
      setError('Failed to load articles. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

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

  return (
    <div>
      <header className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-magazine-primary mb-4">
          Article Archive
        </h1>
        <p className="text-gray-600">
          Browse through all our published articles
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-xl text-gray-600">No articles found.</p>
        </div>
      ) : (
        <>
          <ArticleGrid articles={articles} featuredArticle={false} />
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default ArchivePage;
