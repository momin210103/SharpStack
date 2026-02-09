import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import postService from '../../services/postService';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts();
      const normalized = Array.isArray(data)
        ? data.map((post) => ({
          ...post,
          createdAt: post.createdAt ?? post.CreatedAt ?? post.created_at,
        }))
        : [];
      setPosts(normalized);
    } catch (error) {
      toast.error('Failed to load posts',error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postService.deletePost(id);
      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post', error);
      toast.error('Failed to delete post');
    }
  };

  const handlePublish = async (id) => {
    try {
      await postService.publishPost(id);
      toast.success('Post published successfully');
      fetchPosts();
    } catch (error) {
      console.error('Failed to publish post', error);
      toast.error('Failed to publish post');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return '—';
    }

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts Management</h1>
          <p className="text-gray-600 mt-2">Manage all your blog posts</p>
        </div>
        <Link to="/admin/posts/create" className="btn-primary flex items-center gap-2">
          <FiPlus />
          Create Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 mb-4">No posts yet</p>
          <Link to="/admin/posts/create" className="btn-primary inline-flex items-center gap-2">
            <FiPlus />
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {post.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!post.isPublished && (
                          <button
                            onClick={() => handlePublish(post.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Publish"
                          >
                            <FiEye size={18} />
                          </button>
                        )}
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          className="text-primary-600 hover:text-primary-800"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManagement;
