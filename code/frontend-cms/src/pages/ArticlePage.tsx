import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getArticleBySlug } from '../services/api';
import type { Article } from '../types';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        if (!slug) throw new Error('Article slug is missing');
        
        const data = await getArticleBySlug(slug);
        setArticle(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load article. It may have been removed or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-magazine-primary"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Article Not Found</h2>
        <p className="text-gray-700">{error}</p>
        <Link 
          to="/" 
          className="mt-4 inline-block px-4 py-2 bg-magazine-primary text-white rounded hover:bg-magazine-secondary"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const imageUrl = article.coverImage?.url
    ? `http://localhost:1337${article.coverImage.url}`
    : 'https://via.placeholder.com/1200x600';

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {article.categories.map(category => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-magazine-primary hover:text-white"
            >
              {category.name}
            </Link>
          ))}
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          <Link to={`/author/${article.author.id}`} className="flex items-center group">
            {article.author.avatar && (
              <img 
                src={`http://localhost:1337${article.author.avatar.url}`}
                alt={article.author.name} 
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
            )}
            <span className="font-medium group-hover:text-magazine-primary">
              {article.author.name}
            </span>
          </Link>
          <span className="mx-2">•</span>
          <time dateTime={article.publishedAt}>
            {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
          </time>
          {article.issue && (
            <>
              <span className="mx-2">•</span>
              <Link to={`/issue/${article.issue.id}`} className="hover:text-magazine-primary">
                Issue #{article.issue.issueNumber}
              </Link>
            </>
          )}
        </div>
      </header>
      
      <figure className="mb-8">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-auto rounded-lg shadow-md"
        />
      </figure>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-700 mb-6 font-serif leading-relaxed">
          {article.excerpt}
        </p>
        
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
      
      <div className="border-t border-gray-200 mt-12 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Share this article:</h3>
            <div className="flex space-x-4">
              <button className="text-gray-600 hover:text-blue-600">
                <span className="sr-only">Share on Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-blue-400">
                <span className="sr-only">Share on Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-green-600">
                <span className="sr-only">Share via Email</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          <Link 
            to="/" 
            className="inline-flex items-center text-magazine-primary hover:text-magazine-secondary"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Articles
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticlePage;
