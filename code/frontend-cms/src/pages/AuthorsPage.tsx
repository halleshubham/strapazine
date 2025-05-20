import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuthors } from '../services/api';
import { Author } from '../types';

const AuthorsPage = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        const data = await getAuthors();
        setAuthors(data);
      } catch (err) {
        setError('Failed to load authors. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-magazine-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-magazine-primary mb-4">
          Our Authors
        </h1>
        <p className="text-gray-600">
          Meet the talented writers who contribute to our weekly magazine
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {authors.map((author) => {
          const avatarUrl = author.avatar?.url
            ? `http://localhost:1337${author.avatar.url}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=1a365d&color=fff`;

          return (
            <Link
              key={author.id}
              to={`/author/${author.id}`}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center group"
            >
              <img
                src={avatarUrl}
                alt={author.name}
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-magazine-light group-hover:border-magazine-secondary transition duration-300"
              />
              <h2 className="font-serif text-xl font-bold text-magazine-primary group-hover:text-magazine-secondary transition duration-300">
                {author.name}
              </h2>
              {author.bio && (
                <p className="mt-2 text-gray-600 line-clamp-3">{author.bio}</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AuthorsPage;
