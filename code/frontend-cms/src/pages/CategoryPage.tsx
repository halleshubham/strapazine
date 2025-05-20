import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticlesByCategory } from '../services/api';
import ArticleGrid from '../components/Articles/ArticleGrid';
import Pagination from '../components/Common/Pagination';
import { Article, PaginationData } from '../types';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categoryName, setCategoryName] = useState('');
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
      if (!slug) throw new Error('Category slug is missing');
      
      const response = await getArticlesByCategory(slug, page, 9);
      setArticles(response.data);
      setPagination(response.meta.pagination);
      
      // Get category name from the first article if available
      if (response.data.length > 0 && response.data[0].categories) {
        const category = response.data[0].categories.find(cat => cat.slug === slug);
        if (category) {
          setCategoryName(category.name);
        }
      }
    } catch (err) {
      setError('Failed to load articles for this category.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [slug]);

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
          {categoryName || slug}
        </h1>
        <p className="text-gray-600">
          Browse all our articles in the {categoryName || slug} category
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-xl text-gray-600">No articles found in this category.</p>
        </div>
      ) : (
        <>
          <ArticleGrid articles={articles} />
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default CategoryPage;
