import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticlesByAuthor } from '../services/api';
import ArticleGrid from '../components/Articles/ArticleGrid';
import Pagination from '../components/Common/Pagination';
import type { Article, PaginationData } from '../types';

const AuthorPage = () => {
  const { id } = useParams<{ id: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');
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
      if (!id) throw new Error('Author ID is missing');
      
      const response = await getArticlesByAuthor(parseInt(id), page, 9);
      setArticles(response.data);
      setPagination(response.meta.pagination);
      
      // Get author info from the first article if available
      if (response.data.length > 0 && response.data[0].author) {
        const author = response.data[0].author;
        setAuthorName(author.name);
        setAuthorBio(author.bio || '');
        setAuthorAvatar(author.avatar?.url || '');
      }
    } catch (err) {
      setError('Failed to load articles for this author.');
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

  return (
    <div>
      <header className="mb-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {authorAvatar && (
            <img 
              src={`http://localhost:1337${authorAvatar}`}
              alt={authorName} 
              className="w-32 h-32 rounded-full object-cover border-4 border-magazine-light"
            />
          )}
          
          <div>
            <h1 className="font-serif text-4xl font-bold text-magazine-primary mb-4 text-center md:text-left">
              {authorName}
            </h1>
            {authorBio && (
              <p className="text-gray-600 mb-4 max-w-3xl text-center md:text-left">
                {authorBio}
              </p>
            )}
            <p className="text-gray-500 text-center md:text-left">
              {pagination.total} {pagination.total === 1 ? 'article' : 'articles'} published
            </p>
          </div>
        </div>
      </header>

      {articles.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-xl text-gray-600">No articles found for this author.</p>
        </div>
      ) : (
        <>
          <h2 className="font-serif text-2xl font-bold text-magazine-primary mb-6">
            Articles by {authorName}
          </h2>
          <ArticleGrid articles={articles} featuredArticle={false} />
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default AuthorPage;
