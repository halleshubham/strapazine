import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchArticles } from '../services/api';
import ArticleGrid from '../components/Articles/ArticleGrid';
import Pagination from '../components/Common/Pagination';
import { Article, PaginationData } from '../types'

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    pageSize: 12,
    pageCount: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async (page = 1) => {
    try {
      setLoading(true);
      if (!query.trim()) {
        setArticles([]);
        return;
      }
      
      const response = await searchArticles(query, page, 12);
      setArticles(response.data);
      setPagination(response.meta.pagination);
    } catch (err) {
      setError('Failed to load search results. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query]);

  const handlePageChange = (page: number) => {
    fetchResults(page);
    window.scrollTo(0, 0);
  };

  if (!query.trim()) {
    return (
      <div className="text-center py-20">
        <h1 className="font-serif text-4xl font-bold text-magazine-primary mb-4">
          Search Results
        </h1>
        <p className="text-gray-600">Please enter a search term to find articles.</p>
      </div>
    );
  }

  if (loading && articles.length === 0) {
    return (
      <div className="flex flex-col items-center py-20">
        <h1 className="font-serif text-4xl font-bold text-magazine-primary mb-8">
          Searching for "{query}"
        </h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-magazine-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-serif text-4xl font-bold text-magazine-primary mb-4">
          Search Results for "{query}"
        </h1>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => fetchResults()} 
          className="px-4 py-2 bg-magazine-primary text-white rounded hover:bg-magazine-secondary"
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
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          Found {pagination.total} {pagination.total === 1 ? 'article' : 'articles'} matching your search
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-xl text-gray-600">No articles found matching your search.</p>
          <p className="mt-4 text-gray-500">Try using different keywords or browse our categories.</p>
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

export default SearchPage;
