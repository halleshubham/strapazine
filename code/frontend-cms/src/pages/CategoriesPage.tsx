import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/api';
import { Category } from '../types';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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

  // Array of background colors for categories
  const bgColors = [
    'bg-indigo-600', 'bg-red-600', 'bg-green-600', 'bg-yellow-600', 
    'bg-purple-600', 'bg-pink-600', 'bg-blue-600', 'bg-teal-600'
  ];

  return (
    <div>
      <header className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-magazine-primary mb-4">
          Article Categories
        </h1>
        <p className="text-gray-600">
          Browse our content by topics of interest
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className={`${bgColors[index % bgColors.length]} hover:opacity-90 transition duration-300 rounded-lg shadow-md overflow-hidden`}
          >
            <div className="p-8 text-white text-center">
              <h2 className="font-serif text-2xl font-bold mb-2">
                {category.name}
              </h2>
              <div className="mt-4 inline-block border border-white px-4 py-2 rounded-full text-sm">
                Explore Articles
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
