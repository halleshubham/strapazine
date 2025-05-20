import { Article } from '../../types';
import ArticleCard from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  featuredArticle?: boolean;
}

const ArticleGrid = ({ articles, featuredArticle = true }: ArticleGridProps) => {
  if (articles.length === 0) {
    return <p className="text-center py-12">No articles found.</p>;
  }

  // Show the first article as featured if requested
  const [firstArticle, ...restArticles] = articles;

  return (
    <div>
      {featuredArticle && firstArticle && (
        <ArticleCard article={firstArticle} featured={true} />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(featuredArticle ? restArticles : articles).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticleGrid;
