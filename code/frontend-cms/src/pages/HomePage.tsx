import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles, getCategories } from '../services/api';
import ArticleGrid from '../components/Articles/ArticleGrid';
import Pagination from '../components/Common/Pagination';
import type { Article, Category, PaginationData } from '../types';

const HomePage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getArticles(page, 9);
      setArticles(response.data);
      setPagination(response.meta.pagination);
    } catch (err) {
      setError('Failed to load articles. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
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
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-3xl font-bold text-magazine-primary">
            Latest Articles
          </h2>
          <Link 
            to="/archive" 
            className="text-magazine-secondary hover:underline font-medium"
          >
            View All Articles
          </Link>
        </div>
        <ArticleGrid articles={articles} />
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-3xl font-bold text-magazine-primary mb-6">
          Browse By Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/category/${category.slug}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg text-center transition duration-300 hover:bg-magazine-primary hover:text-white"
            >
              <h3 className="font-serif text-xl">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
