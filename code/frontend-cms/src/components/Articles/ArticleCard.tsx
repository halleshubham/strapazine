import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const imageUrl = article.coverImage?.url 
    ? `http://localhost:1337${article.coverImage.url}` 
    : 'https://via.placeholder.com/600x400';
  
  // Make sure categories is always defined before accessing length
  const categories = article.categories || [];
  
  if (featured) {
    return (
      <div className="mb-10 relative rounded-lg overflow-hidden shadow-lg">
        <div className="h-96 relative">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {categories.length > 0 && (
              <Link 
                to={`/category/${categories[0].slug}`}
                className="inline-block bg-magazine-secondary px-3 py-1 rounded text-sm font-semibold mb-2"
              >
                {categories[0].name}
              </Link>
            )}
            <h2 className="font-serif text-3xl font-bold mb-2">
              <Link to={`/article/${article.slug}`} className="hover:underline">
                {article.title}
              </Link>
            </h2>
            <p className="mb-4 line-clamp-2">{article.excerpt}</p>
            <div className="flex items-center">
              <span className="text-sm">
                By {article.author?.name || 'Unknown Author'} • {format(new Date(article.publishedAt || new Date()), 'MMMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
      <Link to={`/article/${article.slug}`}>
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-5">
        {categories.length > 0 && (
          <Link 
            to={`/category/${categories[0].slug}`}
            className="inline-block bg-gray-200 px-3 py-1 rounded text-sm font-semibold text-gray-700 mb-2"
          >
            {categories[0].name}
          </Link>
        )}
        <h2 className="font-serif text-xl font-bold mb-2">
          <Link to={`/article/${article.slug}`} className="text-gray-900 hover:text-magazine-secondary">
            {article.title}
          </Link>
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>By</span>
          <Link to={`/author/${article.author?.id || 0}`} className="font-medium text-magazine-primary hover:underline ml-1 mr-2">
            {article.author?.name || 'Unknown Author'}
          </Link>
          <span>•</span>
          <time className="ml-2">{format(new Date(article.publishedAt || new Date()), 'MMM d, yyyy')}</time>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
