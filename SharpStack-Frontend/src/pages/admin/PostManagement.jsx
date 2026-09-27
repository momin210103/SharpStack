import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import postService from '../../services/postService';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
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
      console.error('Failed to load posts:', error);
      toast.error('Failed to load posts');
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
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handlePublish = async (id) => {
    try {
      await postService.publishPost(id);
      toast.success('Post published successfully');
      fetchPosts();
    } catch (error) {
      console.error('Failed to publish post:', error);
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
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <LoadingSpinner size="large" />
        <p className="font-mono text-xs text-[var(--color-text-muted)]">
          Loading articles...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-[var(--color-border)]">
        <div>
          {/* Small Kicker */}
          <div className="font-mono text-xs font-semibold tracking-widest text-[var(--color-primary)] uppercase mb-2">
            — CONTENT MANAGEMENT
          </div>
          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--color-text)] tracking-tight">
            Posts
          </h1>
          {/* Supporting Description */}
          <p className="font-serif text-base text-[var(--color-text-muted)] mt-2 max-w-2xl leading-relaxed">
            Manage, edit, and publish your articles.
          </p>
        </div>

        {/* Create Post Button */}
        <Link
          to="/admin/posts/create"
          className="inline-flex items-center justify-center gap-2 font-mono text-xs font-semibold px-4 py-2.5 rounded-[3px] bg-[var(--color-primary)] hover:bg-[#7A4BC9] text-white shadow-xs transition-colors shrink-0"
        >
          <FiPlus size={14} />
          <span>Create Post</span>
        </Link>
      </div>

      {/* CONTENT AREA */}
      {posts.length === 0 ? (
        <div className="p-12 sm:p-16 text-center bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[4px] max-w-lg mx-auto my-6 shadow-xs">
          <div className="w-12 h-12 rounded-[4px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] mx-auto mb-4 font-mono font-bold text-lg">
            #
          </div>
          <p className="font-mono text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase mb-2">
            NO ARTICLES YET
          </p>
          <p className="font-serif text-sm text-[var(--color-text-muted)] mb-6 max-w-sm mx-auto leading-relaxed">
            Create your first article to start publishing knowledge.
          </p>
          <Link
            to="/admin/posts/create"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold px-4 py-2.5 rounded-[3px] bg-[var(--color-primary)] hover:bg-[#7A4BC9] text-white shadow-xs transition-colors"
          >
            <FiPlus size={14} />
            <span>Create Post</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop & Tablet Table (md and up) */}
          <div className="hidden md:block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 font-mono text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">
                    <th className="px-5 py-3.5 font-semibold">Title</th>
                    <th className="px-5 py-3.5 font-semibold">Category</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold">Created</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]/60 font-mono text-xs">
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-[var(--color-surface-secondary)]/30 transition-colors"
                    >
                      {/* Title */}
                      <td className="px-5 py-4 max-w-md">
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          className="font-serif text-sm sm:text-base font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors line-clamp-1 leading-snug"
                        >
                          {post.title}
                        </Link>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono text-[11px] font-semibold tracking-wide text-[var(--color-primary)] uppercase">
                          [ {post.categoryName || 'GENERAL'} ]
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {post.isPublished ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-[2px] bg-[#7EC98F]/10 text-[#7EC98F] border border-[#7EC98F]/30 uppercase font-semibold">
                            <span>✓</span>
                            <span>PUBLISHED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-[2px] bg-[#E5B869]/10 text-[#E5B869] border border-[#E5B869]/30 uppercase font-semibold">
                            <span>●</span>
                            <span>DRAFT</span>
                          </span>
                        )}
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4 text-[var(--color-text-muted)] whitespace-nowrap">
                        {formatDate(post.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {!post.isPublished && (
                            <button
                              onClick={() => handlePublish(post.id)}
                              className="p-1.5 text-[#7EC98F] hover:bg-[#7EC98F]/10 rounded-[2px] transition-colors"
                              title="Publish post"
                              aria-label="Publish post"
                            >
                              <FiEye size={15} />
                            </button>
                          )}
                          <Link
                            to={`/admin/posts/edit/${post.id}`}
                            className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] rounded-[2px] transition-colors"
                            title="Edit post"
                            aria-label="Edit post"
                          >
                            <FiEdit size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-1.5 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-[2px] transition-colors"
                            title="Delete post"
                            aria-label="Delete post"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Post Cards (< md) */}
          <div className="md:hidden space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] shadow-xs space-y-3"
              >
                <Link
                  to={`/admin/posts/edit/${post.id}`}
                  className="block font-serif text-base font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors leading-snug"
                >
                  {post.title}
                </Link>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold text-[var(--color-primary)] uppercase">
                    [ {post.categoryName || 'GENERAL'} ]
                  </span>
                  <span className="text-[var(--color-border)]">·</span>
                  {post.isPublished ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-[2px] bg-[#7EC98F]/10 text-[#7EC98F] border border-[#7EC98F]/30 uppercase font-semibold">
                      <span>✓</span>
                      <span>PUBLISHED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-[2px] bg-[#E5B869]/10 text-[#E5B869] border border-[#E5B869]/30 uppercase font-semibold">
                      <span>●</span>
                      <span>DRAFT</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]/60 text-xs">
                  <span className="font-mono text-xs text-[var(--color-text-muted)]">
                    {formatDate(post.createdAt)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {!post.isPublished && (
                      <button
                        onClick={() => handlePublish(post.id)}
                        className="inline-flex items-center gap-1 font-mono text-xs text-[#7EC98F] hover:bg-[#7EC98F]/10 border border-[#7EC98F]/20 px-2.5 py-1 rounded-[2px] transition-colors"
                        title="Publish post"
                        aria-label="Publish post"
                      >
                        <FiEye size={12} />
                        <span>Publish</span>
                      </button>
                    )}
                    <Link
                      to={`/admin/posts/edit/${post.id}`}
                      className="inline-flex items-center gap-1 font-mono text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] border border-[var(--color-border)] px-2.5 py-1 rounded-[2px] transition-colors"
                      title="Edit post"
                      aria-label="Edit post"
                    >
                      <FiEdit size={12} />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="inline-flex items-center gap-1 font-mono text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-[2px] transition-colors"
                      title="Delete post"
                      aria-label="Delete post"
                    >
                      <FiTrash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PostManagement;
