import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import postService from '../../services/postService';
import categoryService from '../../services/categoryService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getImageUrl } from '../../utils/imageUrl';
import { getTextExcerpt, stripHtmlTags } from '../../utils/textUtils';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [page, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getPublicPosts(page, pageSize, selectedCategory);
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
      console.error('Failed to load categories', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateReadingTime = (content) => {
    if (!content) return '3 min read';
    const text = stripHtmlTags(content);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const scrollToArticles = () =>
    document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors overflow-x-hidden ">
      {/* SECTION 1 — HERO */}
      <section className="border-b border-[var(--color-border)]">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="font-mono text-xs font-semibold tracking-widest text-[var(--color-primary)] uppercase mb-4">
                — DEVELOPER KNOWLEDGE PLATFORM
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--color-text)] leading-[1.1] mb-6">
                Learn. Build. Share. Grow.
              </h1>
              <p className="font-serif text-lg sm:text-xl text-[var(--color-text-muted)] leading-relaxed max-w-2xl lg:max-w-3xl mb-8">
                Practical knowledge, real-world solutions, and engineering insights for modern developers.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#articles"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToArticles();
                  }}
                  className="inline-flex items-center gap-2 font-mono text-xs font-semibold px-5 py-3 rounded-[3px] bg-[var(--color-primary)] hover:bg-[#7A4BC9] text-white shadow-xs transition-colors"
                >
                  Explore Articles →
                </a>
                <Link
                  to={user && isAdmin() ? '/admin/posts/create' : (user ? '/categories' : '/login')}
                  className="inline-flex items-center gap-2 font-mono text-xs font-semibold px-5 py-3 rounded-[3px] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-secondary)] text-[var(--color-text)] hover:border-[var(--color-primary-muted)] transition-colors"
                >
                  Start Writing
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="w-full max-w-xl mx-auto lg:max-w-none">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px] shadow-2xl overflow-hidden font-mono text-xs select-none">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] opacity-80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] opacity-80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] opacity-80" />
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] tracking-wide font-medium">
                      SharpStack
                    </div>
                    <div className="w-10" />
                  </div>
                  <div className="p-6 space-y-3 font-mono leading-relaxed">
                    <div className="flex items-center gap-2 text-[var(--color-text)]">
                      <span className="text-[var(--color-primary)] font-bold">$</span>
                      <span>dotnet run</span>
                    </div>
                    <div className="pt-2 space-y-2 text-xs">
                      {['Build successful', 'API running', 'Ready to learn'].map((t) => (
                        <div key={t} className="flex items-center gap-2 text-[var(--color-success)] font-medium">
                          <span>✓</span>
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 text-[var(--color-text-muted)] flex items-center gap-1 text-[11px]">
                      <span className="text-[var(--color-primary)] opacity-70">&gt;</span>
                      <span>Listening on localhost:5000</span>
                      <span className="inline-block w-1.5 h-3.5 bg-[var(--color-primary)] ml-1 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — CATEGORY / TOPIC AREA */}
      {categories.length > 0 && (
        <nav
          className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/30 backdrop-blur-xs sticky top-16 z-20"
          aria-label="Filter by Topic"
        >
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setPage(1);
                }}
                className={`font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-[3px] transition-colors whitespace-nowrap ${
                  !selectedCategory
                    ? 'bg-[var(--color-primary)] text-white font-semibold shadow-xs'
                    : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary-muted)] bg-[var(--color-surface)]'
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
                  className={`font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-[3px] transition-colors whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-[var(--color-primary)] text-white font-semibold shadow-xs'
                      : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary-muted)] bg-[var(--color-surface)]'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* SECTION 2 — LATEST ARTICLES */}
      <section id="articles" className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8 pb-4 border-b border-[var(--color-border)]">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--color-text)] tracking-tight">
              Latest Articles
            </h2>
            <p className="font-serif text-sm text-[var(--color-text-muted)] mt-1">
              {selectedCategory
                ? 'Showing articles filtered by selected topic'
                : 'Practical engineering insights, architectural patterns, and deep dives'}
            </p>
          </div>
          <div className="font-mono text-xs text-[var(--color-text-muted)]">
            Showing {posts.length} {posts.length === 1 ? 'article' : 'articles'}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <LoadingSpinner size="large" />
            <p className="font-mono text-xs text-[var(--color-text-muted)]">Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 px-6 border border-dashed border-[var(--color-border)] rounded-[4px] bg-[var(--color-surface)]/40 max-w-lg mx-auto">
            <p className="font-serif text-xl font-semibold text-[var(--color-text)] mb-2">
              No articles found
            </p>
            <p className="font-serif text-sm text-[var(--color-text-muted)] mb-6">
              There are no published articles in this topic yet. Check back soon or browse other topics.
            </p>
            {selectedCategory && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setPage(1);
                }}
                className="font-mono text-xs px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] rounded-[3px] transition-colors"
              >
                Clear Topic Filter
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Compact card grid: 1 col mobile, 2 tablet, 3 desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {posts.map((post, index) => (
                <Link
                  key={`${post.id ?? post.slug ?? 'post'}-${index}`}
                  to={`/post/${post.slug}`}
                  className="group flex flex-col overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px] hover:border-[var(--color-primary-muted)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
                >
                  {/* Image (full-bleed, 16:9) */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-surface-secondary)] border-b border-[var(--color-border)]">
                    {post.images?.[0]?.url ? (
                      <img
                        src={getImageUrl(post.images[0].url)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-secondary)] select-none">
                        <span className="font-mono text-2xl text-[var(--color-primary)] opacity-60">
                          &lt;/&gt;
                        </span>
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 font-mono text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-[3px] bg-[var(--color-bg)]/80 backdrop-blur-sm text-[var(--color-primary)] border border-[var(--color-border)]">
                      {post.categoryName || 'Development'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-3.5">
                    <h3 className="font-serif text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-snug mb-1">
                      {post.title}
                    </h3>
                    <p className="font-serif text-[13px] text-[var(--color-text-muted)] line-clamp-2 leading-relaxed mb-3">
                      {getTextExcerpt(post.content, 90)}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-2.5 border-t border-[var(--color-border)]/60 font-mono text-[10px] text-[var(--color-text-muted)]">
                      <span>{formatDate(post.createdAt)}</span>
                      <span>{calculateReadingTime(post.content)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-12 font-mono text-xs">
              <button
                onClick={() => {
                  setPage(page - 1);
                  scrollToArticles();
                }}
                disabled={page === 1}
                className="px-4 py-2 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] rounded-[3px] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <span className="px-3.5 py-2 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] rounded-[3px]">
                Page {page}
              </span>
              <button
                onClick={() => {
                  setPage(page + 1);
                  scrollToArticles();
                }}
                disabled={posts.length < pageSize}
                className="px-4 py-2 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] rounded-[3px] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Home;