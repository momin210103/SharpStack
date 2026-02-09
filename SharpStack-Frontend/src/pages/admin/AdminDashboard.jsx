import { Link } from 'react-router-dom';
import { FiFileText, FiEye, FiEyeOff, FiPlus } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import statisticService from '../../services/statisticService';
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await statisticService.getStatistics();
        setStats(data);

      } catch (error) {
        console.error(error);
        setError("Failed to load statistics.");

      } finally {
        setLoading(false);
      }
    };
    loadStats();

  }, []);
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Posts</p>
              {loading ? (
                <p className="text-3xl font-bold text-gray-900 mt-2">Loading...</p>
              ) : error ? (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              ) : (
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalPosts}</p>
              )}  
          
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <FiFileText className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Published</p>
              {loading ? (
                <p className="text-3xl font-bold text-gray-900 mt-2">Loading...</p>
              ):error ? (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              ) : (
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.publishedPosts}</p>
              )}
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiEye className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Drafts</p>
              {loading ? (
                <p className="text-3xl font-bold text-gray-900 mt-2">Loading...</p>
              ) : error ? (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              ) : (
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.unpublishedPosts}</p>
              )}
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiEyeOff className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/posts/create"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <FiPlus className="text-primary-600" size={24} />
            <div>
              <p className="font-medium text-gray-900">Create New Post</p>
              <p className="text-sm text-gray-600">Write a new blog post</p>
            </div>
          </Link>

          <Link
            to="/admin/posts"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <FiFileText className="text-primary-600" size={24} />
            <div>
              <p className="font-medium text-gray-900">Manage Posts</p>
              <p className="text-sm text-gray-600">View and edit posts</p>
            </div>
          </Link>

          <Link
            to="/admin/categories"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <FiFileText className="text-primary-600" size={24} />
            <div>
              <p className="font-medium text-gray-900">Manage Categories</p>
              <p className="text-sm text-gray-600">Add or edit categories</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
