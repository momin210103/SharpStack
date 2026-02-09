import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import postService from '../../services/postService';
import categoryService from '../../services/categoryService';
import toast from 'react-hot-toast';
import { FiClock, FiTag } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getImageUrl } from '../../utils/imageUrl';
import { getTextExcerpt } from '../../utils/textUtils';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [page, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getPublicPosts(page, pageSize, selectedCategory);
      console.log('RAW API Response:', JSON.stringify(data[0], null, 2));
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories',error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-5xl font-bold mb-4">Welcome to Our SharpStack</h1>
          <p className="text-xl text-primary-100">
            A learning platform to share knowledge and grow together.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full transition-colors ${!selectedCategory
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                All
              </button>
              {categories.map((category, index) => (
                <button
                  key={`${category.id ?? category.name ?? 'category'}-${index}`}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No posts found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => {
                console.log('Rendering post:', post.title, 'slug:', post.slug);
                return (
                  <Link
                    key={`${post.id ?? post.slug ?? 'post'}-${index}`}
                    to={`/post/${post.slug}`}
                    className="card overflow-hidden group"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary-400 to-primary-600 relative overflow-hidden">
                      {post.images?.[0]?.url ? (
                        <img
                          src={getImageUrl(post.images[0].url)}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-sm opacity-50">
                          No image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <FiTag size={14} />
                          {post.categoryName}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock size={14} />
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                      {/* <h1>Image Section</h1> */}
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-gray-600 line-clamp-3">
                        {getTextExcerpt(post.content, 150)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={posts.length < pageSize}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
