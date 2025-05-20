import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from './components/Layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import AuthorPage from './pages/AuthorPage';
import IssuesPage from './pages/IssuesPage';
import IssuePage from './pages/IssuePage';
import AuthorsPage from './pages/AuthorsPage';
import CategoriesPage from './pages/CategoriesPage';
import ArchivePage from './pages/ArchivePage';
import SearchPage from './pages/SearchPage';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/author/:id" element={<AuthorPage />} />
            <Route path="/issues" element={<IssuesPage />} />
            <Route path="/issue/:id" element={<IssuePage />} />
            <Route path="/authors" element={<AuthorsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={
              <div className="py-20 text-center">
                <h1 className="font-serif text-4xl font-bold text-magazine-primary mb-4">
                  404 - Page Not Found
                </h1>
                <p className="text-gray-600 mb-8">
                  The page you are looking for doesn't exist or has been moved.
                </p>
                <a 
                  href="/"
                  className="px-6 py-3 bg-magazine-primary text-white rounded-lg hover:bg-magazine-secondary transition duration-300"
                >
                  Return to Homepage
                </a>
              </div>
            } />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
