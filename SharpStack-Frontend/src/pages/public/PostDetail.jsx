import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import postService from '../../services/postService';
import commentService from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FiClock,
  FiUser,
  FiEdit2,
  FiTrash2,
  FiArrowLeft,
  FiShare2,
  FiCheck,
} from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getImageUrl } from '../../utils/imageUrl';
import { stripHtmlTags } from '../../utils/textUtils';
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
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [copied, setCopied] = useState(false);

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
      await fetchRelatedPosts(
        postData.categoryId,
        postData.id || postData.postId,
        postData.categoryName
      );
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

  const fetchRelatedPosts = async (categoryId, currentPostId, categoryName) => {
    try {
      const data = await postService.getPublicPosts(1, 20, categoryId || null);
      const allPosts = data.posts || data.items || (Array.isArray(data) ? data : []);
      const posts = allPosts.filter((p) => {
        const isSelf = (p.id || p.postId) === currentPostId;
        const isSameCategory = categoryId
          ? p.categoryId === categoryId
          : p.categoryName === categoryName;
        return !isSelf && isSameCategory;
      });
      setRelatedPosts(posts.slice(0, 6));
    } catch (error) {
      console.error('Failed to load related posts', error);
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
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateReadingTime = (content) => {
    if (!content) return '3 min read';
    const text = stripHtmlTags(content);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Article link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] space-y-4">
        <LoadingSpinner size="large" />
        <p className="font-mono text-xs text-[var(--color-text-muted)]">
          Loading article...
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[var(--color-bg)] px-4">
        <div className="text-center p-8 border border-[var(--color-border)] rounded-[4px] bg-[var(--color-surface)] max-w-md w-full">
          <p className="font-mono text-xs text-[var(--color-primary)] font-semibold uppercase tracking-wider mb-2">
            404 // NOT FOUND
          </p>
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-text)] mb-3">
            Article Not Found
          </h2>
          <p className="font-serif text-sm text-[var(--color-text-muted)] mb-6 leading-relaxed">
            The requested article could not be found. It may have been moved or unpublished.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold px-4 py-2.5 rounded-[3px] bg-[var(--color-primary)] hover:bg-[#7A4BC9] text-white transition-colors"
          >
            ← Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors py-10 sm:py-14">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={13} />
            <span>← Back to all articles</span>
          </Link>
        </div>

        {/* 2-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Main Reading Column (8 cols) */}
          <article className="lg:col-span-8 min-w-0">
            {/* Header: Topic, Timestamp, Reading time */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs mb-4">
              <span className="font-semibold tracking-wider text-[var(--color-primary)] uppercase">
                [ {post.categoryName || 'ENGINEERING'} ]
              </span>
              <span className="text-[var(--color-border)]">|</span>
              <span className="text-[var(--color-text-muted)] flex items-center gap-1.5">
                <FiClock size={13} />
                {formatDate(post.createdAt)}
              </span>
              <span className="text-[var(--color-border)]">|</span>
              <span className="text-[var(--color-text-muted)]">
                {calculateReadingTime(post.content)}
              </span>
            </div>

            {/* Article Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-[var(--color-text)] tracking-tight leading-[1.18] mb-6">
              {post.title}
            </h1>

            {/* Author & Action Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-[var(--color-border)] mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center font-mono text-xs font-bold text-[var(--color-primary)] uppercase">
                  {post.authorName ? post.authorName.charAt(0) : <FiUser size={14} />}
                </div>
                <div>
                  <span className="font-mono text-xs font-semibold text-[var(--color-text)] block">
                    {post.authorName || 'SharpStack Contributor'}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                    Engineering Editorial
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-secondary)] px-3 py-1.5 rounded-[3px] transition-colors"
                  title="Share link"
                >
                  {copied ? <FiCheck size={12} className="text-[var(--color-success)]" /> : <FiShare2 size={12} />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>

                {user && isAdmin() && (
                  <Link
                    to={`/admin/posts/edit/${post.id || post.postId}`}
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-primary)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-secondary)] hover:border-[var(--color-primary-muted)] px-3 py-1.5 rounded-[3px] transition-colors"
                  >
                    <FiEdit2 size={12} />
                    <span>Edit Article</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Featured Image & Gallery */}
            {images.length > 0 && (
              <div className="mb-10">
                {/* Main Selected Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[4px] border border-[var(--color-border)] bg-[var(--color-surface-secondary)] shadow-xs">
                  <img
                    src={selectedImage || getImageUrl(images[0].url)}
                    alt={post.title}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Thumbnail Gallery (when multiple images exist) */}
                {images.length > 1 && (
                  <div className="flex flex-wrap gap-2.5 mt-3.5">
                    {images.map((image) => {
                      const imgUrl = getImageUrl(image.url);
                      const isSelected = selectedImage === imgUrl;
                      return (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => setSelectedImage(imgUrl)}
                          className={`cursor-pointer rounded-[3px] overflow-hidden border-2 transition-all w-20 h-14 bg-[var(--color-surface-secondary)] ${
                            isSelected
                              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
                              : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={image.fileName || 'Gallery thumbnail'}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Article Long-Form Body (Quill) */}
            <div className="prose max-w-none mb-14 pb-10 border-b border-[var(--color-border)]">
              <div
                className="article-content ql-editor"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Discussion / Comments Section */}
            <section className="mt-10">
              <div className="flex items-center justify-between pb-4 mb-8 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-2xl font-semibold text-[var(--color-text)]">
                    Discussion
                  </h2>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                    {comments.length}
                  </span>
                </div>
              </div>

              {/* Add Comment Form or Login Notice */}
              {user ? (
                <form onSubmit={handleSubmitComment} className="mb-10">
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] p-4 focus-within:border-[var(--color-primary)] transition-colors">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add your insight or question to the discussion..."
                      className="w-full bg-transparent text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none min-h-[96px] resize-none font-serif text-sm leading-relaxed"
                      maxLength={1000}
                    />
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-[var(--color-border)]/60">
                      <span className="font-mono text-xs text-[var(--color-text-muted)]">
                        {newComment.length}/1000
                      </span>
                      <button
                        type="submit"
                        disabled={commentLoading || !newComment.trim()}
                        className="font-mono text-xs font-semibold px-4 py-2 rounded-[3px] bg-[var(--color-primary)] hover:bg-[#7A4BC9] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {commentLoading ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[4px] p-6 mb-10 text-center">
                  <p className="font-serif text-sm text-[var(--color-text-muted)] mb-3">
                    Join the discussion to share your thoughts, solutions, or questions.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 font-mono text-xs font-semibold px-4 py-2 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    Sign in to Comment →
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-10 px-4 border border-[var(--color-border)]/50 rounded-[4px] bg-[var(--color-surface)]/40">
                    <p className="font-serif text-sm text-[var(--color-text-muted)]">
                      No comments yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] transition-colors"
                    >
                      {/* Comment Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center font-mono text-xs font-bold text-[var(--color-primary)] uppercase">
                            {comment.userDisplayName ? comment.userDisplayName.charAt(0) : <FiUser size={14} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-[var(--color-text)]">
                                {comment.userDisplayName || 'Anonymous User'}
                              </span>
                              {comment.userRole === 'Admin' && (
                                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 uppercase font-semibold">
                                  Staff
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Comment Actions (Edit / Delete) */}
                        {user && (user.id === comment.userId || isAdmin()) && (
                          <div className="flex items-center gap-1 font-mono text-xs">
                            {user.id === comment.userId && (
                              <button
                                onClick={() => {
                                  setEditingComment(comment.id);
                                  setEditContent(comment.content);
                                }}
                                className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] rounded transition-colors"
                                title="Edit comment"
                              >
                                <FiEdit2 size={13} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="p-1.5 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-[var(--color-surface-secondary)] rounded transition-colors"
                              title="Delete comment"
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Comment Body or Inline Editor */}
                      {editingComment === comment.id ? (
                        <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text)] rounded-[3px] p-3 text-sm font-serif outline-none focus:border-[var(--color-primary)] min-h-[80px] resize-none"
                            maxLength={1000}
                          />
                          <div className="flex items-center justify-between mt-2.5">
                            <span className="font-mono text-xs text-[var(--color-text-muted)]">
                              {editContent.length}/1000
                            </span>
                            <div className="flex items-center gap-2 font-mono text-xs">
                              <button
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditContent('');
                                }}
                                className="px-3 py-1.5 rounded-[3px] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditComment(comment.id)}
                                className="px-3 py-1.5 rounded-[3px] bg-[var(--color-primary)] text-white hover:bg-[#7A4BC9] font-medium transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="font-serif text-sm sm:text-base text-[var(--color-text)] leading-relaxed mt-3.5 whitespace-pre-line">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </article>

          {/* Sidebar (4 cols on lg, sticky on desktop) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Metadata Card */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] p-5">
              <div className="font-mono text-[11px] font-semibold tracking-wider text-[var(--color-primary)] uppercase mb-3">
                // ARTICLE INTEL
              </div>
              <dl className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]/50">
                  <dt className="text-[var(--color-text-muted)]">Topic</dt>
                  <dd className="font-semibold text-[var(--color-text)]">
                    {post.categoryName || 'General'}
                  </dd>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]/50">
                  <dt className="text-[var(--color-text-muted)]">Read Time</dt>
                  <dd className="text-[var(--color-text)]">
                    {calculateReadingTime(post.content)}
                  </dd>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]/50">
                  <dt className="text-[var(--color-text-muted)]">Published</dt>
                  <dd className="text-[var(--color-text)]">
                    {formatDate(post.createdAt)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[var(--color-text-muted)]">Comments</dt>
                  <dd className="text-[var(--color-text)]">
                    {comments.length}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Related Topics & Articles */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] p-5">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--color-border)]">
                <div className="font-mono text-[11px] font-semibold tracking-wider text-[var(--color-primary)] uppercase">
                  // RELATED TOPICS
                </div>
                <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                  {relatedPosts.length}
                </span>
              </div>

              {relatedPosts.length === 0 ? (
                <p className="font-serif text-xs text-[var(--color-text-muted)] italic">
                  No other articles found in this topic.
                </p>
              ) : (
                <div className="space-y-3">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.id || related.postId}
                      to={`/post/${related.slug}`}
                      className="group block p-3 rounded-[3px] border border-[var(--color-border)]/70 bg-[var(--color-surface-secondary)]/30 hover:bg-[var(--color-surface-secondary)] hover:border-[var(--color-primary-muted)] transition-all"
                    >
                      <span className="font-mono text-[10px] tracking-wider text-[var(--color-primary)] uppercase">
                        {related.categoryName || post.categoryName}
                      </span>
                      <h4 className="font-serif text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-snug mt-1">
                        {related.title}
                      </h4>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--color-text-muted)] mt-2">
                        <span>{formatDate(related.createdAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
