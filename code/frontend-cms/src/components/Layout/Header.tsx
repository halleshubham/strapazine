import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-6">
          <Link to="/" className="font-serif text-3xl font-bold text-magazine-primary">
            Modern Weekly
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-magazine-secondary">Home</Link>
            <Link to="/issues" className="text-gray-700 hover:text-magazine-secondary">Issues</Link>
            <Link to="/categories" className="text-gray-700 hover:text-magazine-secondary">Categories</Link>
            <Link to="/authors" className="text-gray-700 hover:text-magazine-secondary">Authors</Link>
            <Link to="/archive" className="text-gray-700 hover:text-magazine-secondary">Archive</Link>
          </div>
          
          <div className="hidden md:block">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search articles..."
                className="px-4 py-2 rounded-l border border-gray-300 focus:outline-none focus:ring-2 focus:ring-magazine-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-magazine-primary text-white p-2 rounded-r"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            </form>
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-magazine-secondary">Home</Link>
              <Link to="/issues" className="text-gray-700 hover:text-magazine-secondary">Issues</Link>
              <Link to="/categories" className="text-gray-700 hover:text-magazine-secondary">Categories</Link>
              <Link to="/authors" className="text-gray-700 hover:text-magazine-secondary">Authors</Link>
              <Link to="/archive" className="text-gray-700 hover:text-magazine-secondary">Archive</Link>
            </nav>
            <form onSubmit={handleSearch} className="mt-4 flex items-center">
              <input
                type="text"
                placeholder="Search articles..."
                className="px-4 py-2 rounded-l border border-gray-300 focus:outline-none flex-grow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-magazine-primary text-white p-2 rounded-r"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
