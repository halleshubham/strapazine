import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const imageUrl = article.coverImage?.url 
    ? `http://localhost:1337${article.coverImage.url}` 
    : 'https://via.placeholder.com/600x400';
  
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
            {article.categories.length > 0 && (
              <Link 
                to={`/category/${article.categories[0].slug}`}
                className="inline-block bg-magazine-secondary px-3 py-1 rounded text-sm font-semibold mb-2"
              >
                {article.categories[0].name}
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
                By {article.author.name} • {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
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
        {article.categories.length > 0 && (
          <Link 
            to={`/category/${article.categories[0].slug}`}
            className="inline-block bg-gray-200 px-3 py-1 rounded text-sm font-semibold text-gray-700 mb-2"
          >
            {article.categories[0].name}
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
          <Link to={`/author/${article.author.id}`} className="font-medium text-magazine-primary hover:underline ml-1 mr-2">
            {article.author.name}
          </Link>
          <span>•</span>
          <time className="ml-2">{format(new Date(article.publishedAt), 'MMM d, yyyy')}</time>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
