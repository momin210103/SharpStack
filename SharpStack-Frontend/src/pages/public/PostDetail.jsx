import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import postService from '../../services/postService';
import commentService from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiClock, FiTag, FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getImageUrl } from '../../utils/imageUrl';
import 'react-quill-new/dist/quill.snow.css';
import '../../styles/quill-custom.css';

const PostDetail = () => {
  const { slug } = useParams();
  const { user, isAdmin } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const postData = await postService.getPostBySlug(slug);
      console.log('Post data received:', postData);
      setPost(postData);
      const actualPostId = postData.id || postData.postId;
      if (actualPostId) {
        await fetchComments(actualPostId);
        await fetchImages(actualPostId);
      } else {
        console.error('Post ID not found in response:', postData);
      }
    } catch (error) {
      console.error('Failed to load post', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (postId) => {
    try {
      const response = await postService.getPostImages(postId);
      setImages(response.images || []);
      if (response.images?.length > 0) {
        setSelectedImage(getImageUrl(response.images[0].url));
      }
    } catch (error) {
      console.error('Failed to load images', error);
    }
  };


  const fetchComments = async (postId) => {
    try {
      const data = await commentService.getCommentsByPostId(postId);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      setCommentLoading(true);
      await commentService.createComment(post.id, newComment);
      toast.success('Comment added successfully');
      setNewComment('');
      await fetchComments(post.id);
    } catch (error) {
      console.error('Failed to add comment', error);
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await commentService.updateComment(post.id, commentId, editContent);
      toast.success('Comment updated successfully');
      setEditingComment(null);
      setEditContent('');
      await fetchComments(post.id);
    } catch (error) {
      console.error('Failed to update comment', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await commentService.deleteComment(post.id, commentId);
      toast.success('Comment deleted successfully');
      await fetchComments(post.id);
    } catch (error) {
      console.error('Failed to delete comment', error);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Post Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <FiTag size={14} />
              {post.categoryName}
            </span>
            <span className="flex items-center gap-1">
              <FiClock size={14} />
              {formatDate(post.createdAt)}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="mb-6">
              {/* Main Image */}
              <div className="mb-4">
                <img
                  src={selectedImage || getImageUrl(images[0].url)}
                  alt="Post Image"
                  className="w-full h-96 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => setSelectedImage(getImageUrl(image.url))}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedImage === getImageUrl(image.url)
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-primary-300'
                        }`}
                    >
                      <img
                        src={getImageUrl(image.url)}
                        alt={image.fileName}
                        className="w-full h-20 object-cover"
                        onError={(e) => {
                          console.error('Thumbnail failed to load:', e.target.src);
                        }}
                      />
                      {image.isFeatured && (
                        <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs px-1">
                          Featured
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="prose max-w-none">
            <div 
              className="ql-editor text-gray-700 text-lg leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h2>

          {/* Add Comment Form */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="input-field min-h-[100px] resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {newComment.length}/1000 characters
                </span>
                <button
                  type="submit"
                  disabled={commentLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-center">
              <p className="text-gray-600">Please login to leave a comment</p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-primary-600" size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{comment.userDisplayName}</p>
                        <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                    {user && (user.id === comment.userId || isAdmin()) && (
                      <div className="flex gap-2">
                        {user.id === comment.userId && (
                          <button
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditContent(comment.content);
                            }}
                            className="text-gray-500 hover:text-primary-600"
                          >
                            <FiEdit2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  {editingComment === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="input-field min-h-[80px] resize-none"
                        maxLength={1000}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="btn-primary text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingComment(null);
                            setEditContent('');
                          }}
                          className="btn-secondary text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 mt-2">{comment.content}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
