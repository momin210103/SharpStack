import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFileText,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiTag,
  FiArrowRight,
} from 'react-icons/fi';
import statisticService from '../../services/statisticService';
import postService from '../../services/postService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await statisticService.getStatistics();
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to load statistics.');
      } finally {
        setLoading(false);
      }

      try {
        const postsData = await postService.getAllPosts();
        if (Array.isArray(postsData)) {
          const sorted = [...postsData].sort(
            (a, b) =>
              new Date(b.createdAt ?? b.CreatedAt ?? 0) -
              new Date(a.createdAt ?? a.CreatedAt ?? 0)
          );
          setRecentPosts(sorted.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load recent posts for overview:', err);
      }
    };

    loadDashboardData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatStatNumber = (num) => {
    if (num === null || num === undefined) return '00';
    return String(num).padStart(2, '0');
  };

  return (
    <div className="space-y-10">
      {/* SECTION 1 — MAIN HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-[var(--color-border)]">
        <div>
          {/* Small Kicker */}
          <div className="font-mono text-xs font-semibold tracking-widest text-[var(--color-primary)] uppercase mb-2">
            — ADMIN CONSOLE
          </div>
          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--color-text)] tracking-tight">
            Dashboard
          </h1>
          {/* Supporting Description */}
          <p className="font-serif text-base text-[var(--color-text-muted)] mt-2 max-w-2xl leading-relaxed">
            Manage your articles, categories, and publishing workflow.
          </p>
        </div>

        {/* Primary CTA */}
        <Link
          to="/admin/posts/create"
          className="inline-flex items-center justify-center gap-2 font-mono text-xs font-semibold px-4 py-2.5 rounded-[3px] bg-[var(--color-primary)] hover:bg-[#7A4BC9] text-white shadow-xs transition-colors shrink-0"
        >
          <FiPlus size={14} />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* SECTION 2 — STATISTICS CARDS */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Total Posts Card */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] p-6 shadow-xs hover:border-[var(--color-primary)]/40 hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
                TOTAL POSTS
              </span>
              <div className="w-9 h-9 rounded-[3px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 flex items-center justify-center">
                <FiFileText size={18} />
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="font-mono text-3xl sm:text-4xl font-bold text-[var(--color-text-muted)] animate-pulse">
                  --
                </div>
              ) : error ? (
                <div className="font-mono text-sm text-red-400 mt-2">{error}</div>
              ) : (
                <div className="font-mono text-3xl sm:text-4xl font-bold text-[var(--color-text)] tracking-tight">
                  {formatStatNumber(stats?.totalPosts)}
                </div>
              )}
              <p className="font-serif text-xs text-[var(--color-text-muted)] mt-2">
                All articles across topics
              </p>
            </div>
          </div>

          {/* Published Card */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] p-6 shadow-xs hover:border-[#7EC98F]/40 hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
                PUBLISHED
              </span>
              <div className="w-9 h-9 rounded-[3px] bg-[#7EC98F]/10 text-[#7EC98F] border border-[#7EC98F]/20 flex items-center justify-center">
                <FiEye size={18} />
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="font-mono text-3xl sm:text-4xl font-bold text-[var(--color-text-muted)] animate-pulse">
                  --
                </div>
              ) : error ? (
                <div className="font-mono text-sm text-red-400 mt-2">{error}</div>
              ) : (
                <div className="font-mono text-3xl sm:text-4xl font-bold text-[var(--color-text)] tracking-tight">
                  {formatStatNumber(stats?.publishedPosts)}
                </div>
              )}
              <p className="font-serif text-xs text-[var(--color-text-muted)] mt-2">
                Live on public feed
              </p>
            </div>
          </div>

          {/* Drafts Card */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] p-6 shadow-xs hover:border-[#E5B869]/40 hover:-translate-y-0.5 transition-all duration-200 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
                DRAFTS
              </span>
              <div className="w-9 h-9 rounded-[3px] bg-[#E5B869]/10 text-[#E5B869] border border-[#E5B869]/20 flex items-center justify-center">
                <FiEyeOff size={18} />
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="font-mono text-3xl sm:text-4xl font-bold text-[var(--color-text-muted)] animate-pulse">
                  --
                </div>
              ) : error ? (
                <div className="font-mono text-sm text-red-400 mt-2">{error}</div>
              ) : (
                <div className="font-mono text-3xl sm:text-4xl font-bold text-[var(--color-text)] tracking-tight">
                  {formatStatNumber(stats?.unpublishedPosts)}
                </div>
              )}
              <p className="font-serif text-xs text-[var(--color-text-muted)] mt-2">
                Unpublished articles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 — QUICK ACTIONS */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--color-text)] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Action 1: Create Post */}
          <Link
            to="/admin/posts/create"
            className="group flex items-start justify-between p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)]/40 transition-all duration-200 hover:-translate-y-0.5 shadow-xs"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-105 group-hover:border-[var(--color-primary)]/40 transition-all shrink-0">
                <FiPlus size={20} />
              </div>
              <div>
                <p className="font-serif text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  Create New Post
                </p>
                <p className="font-serif text-xs text-[var(--color-text-muted)] mt-1">
                  Write a new blog post
                </p>
              </div>
            </div>
            <span className="font-mono text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all pt-1">
              →
            </span>
          </Link>

          {/* Action 2: Manage Posts */}
          <Link
            to="/admin/posts"
            className="group flex items-start justify-between p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)]/40 transition-all duration-200 hover:-translate-y-0.5 shadow-xs"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-105 group-hover:border-[var(--color-primary)]/40 transition-all shrink-0">
                <FiFileText size={18} />
              </div>
              <div>
                <p className="font-serif text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  Manage Posts
                </p>
                <p className="font-serif text-xs text-[var(--color-text-muted)] mt-1">
                  View and edit posts
                </p>
              </div>
            </div>
            <span className="font-mono text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all pt-1">
              →
            </span>
          </Link>

          {/* Action 3: Manage Categories */}
          <Link
            to="/admin/categories"
            className="group flex items-start justify-between p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)]/40 transition-all duration-200 hover:-translate-y-0.5 shadow-xs sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-105 group-hover:border-[var(--color-primary)]/40 transition-all shrink-0">
                <FiTag size={18} />
              </div>
              <div>
                <p className="font-serif text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  Manage Categories
                </p>
                <p className="font-serif text-xs text-[var(--color-text-muted)] mt-1">
                  Add or edit categories
                </p>
              </div>
            </div>
            <span className="font-mono text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all pt-1">
              →
            </span>
          </Link>
        </div>
      </div>

      {/* SECTION 4 — RECENT POSTS / CONTENT OVERVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
          <div>
            <div className="font-mono text-[10px] font-semibold tracking-widest text-[var(--color-primary)] uppercase mb-1">
              // OVERVIEW
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--color-text)]">
              Recent Articles
            </h2>
          </div>
          <Link
            to="/admin/posts"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <span>View All Posts</span>
            <FiArrowRight size={12} />
          </Link>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] overflow-hidden shadow-xs">
          {recentPosts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-serif text-sm text-[var(--color-text-muted)] mb-4">
                No articles found in the system yet.
              </p>
              <Link
                to="/admin/posts/create"
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold px-4 py-2 rounded-[3px] bg-[var(--color-primary)] hover:bg-[#7A4BC9] text-white transition-colors"
              >
                <FiPlus size={13} />
                <span>Write First Article</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 font-mono text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">
                    <th className="px-5 py-3.5 font-semibold">Title</th>
                    <th className="px-5 py-3.5 font-semibold">Category</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold">Created</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]/60 font-mono text-xs">
                  {recentPosts.map((post) => (
                    <tr
                      key={post.id ?? post.postId}
                      className="hover:bg-[var(--color-surface-secondary)]/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 max-w-md">
                        <Link
                          to={`/admin/posts/edit/${post.id ?? post.postId}`}
                          className="font-serif text-sm sm:text-base font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-[11px] font-semibold tracking-wide text-[var(--color-primary)] uppercase">
                          [ {post.categoryName || 'GENERAL'} ]
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center font-mono text-[10px] px-2 py-0.5 rounded-[2px] uppercase font-semibold border ${
                            post.isPublished
                              ? 'bg-[#7EC98F]/10 text-[#7EC98F] border-[#7EC98F]/30'
                              : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] border-[var(--color-border)]'
                          }`}
                        >
                          {post.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[var(--color-text-muted)] whitespace-nowrap">
                        {formatDate(post.createdAt ?? post.CreatedAt)}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <Link
                          to={`/admin/posts/edit/${post.id ?? post.postId}`}
                          className="inline-flex items-center gap-1 font-mono text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors px-2 py-1 rounded-[2px] hover:bg-[var(--color-surface-secondary)]"
                        >
                          <span>Edit</span>
                          <FiArrowRight size={11} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
