import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryService from '../../services/categoryService';
import toast from 'react-hot-toast';
import { FiCheck, FiArrowLeft } from 'react-icons/fi';

export default function ManageCategory() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/#/g, 'sharp')
      .replace(/[^\w-]+/g, '');
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setForm({
      ...form,
      name: value,
      slug: generateSlug(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Category Name is required');
      return;
    }

    try {
      setLoading(true);
      await categoryService.create(form);
      toast.success('Category created successfully');

      setForm({
        name: '',
        slug: '',
        isActive: true,
      });
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(error.response?.data?.message || 'Error creating category');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <div className="space-y-8 max-w-8xl mx-auto pb-12">
      {/* PAGE HEADER */}
      <div className="pb-6 border-b border-[var(--color-border)]">
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-3 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" size={13} />
          <span>← Back to Dashboard</span>
        </button>
        <div className="font-mono text-xs font-semibold tracking-widest text-[var(--color-primary)] uppercase mb-2">
          — CATEGORY MANAGEMENT
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--color-text)] tracking-tight">
          Create Category
        </h1>
        <p className="font-serif text-base text-[var(--color-text-muted)] mt-2 leading-relaxed">
          Create and manage categories for your blog posts.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] p-6 sm:p-8 space-y-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label
              htmlFor="categoryName"
              className="block font-mono text-xs font-semibold tracking-wider text-[var(--color-text-muted)] uppercase mb-2"
            >
              Category Name <span className="text-[var(--color-primary)]">*</span>
            </label>
            <input
              id="categoryName"
              type="text"
              value={form.name}
              onChange={handleNameChange}
              placeholder="Enter category name"
              className="w-full px-4 py-2.5 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] outline-none transition-colors"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="categorySlug"
              className="block font-mono text-xs font-semibold tracking-wider text-[var(--color-text-muted)] uppercase mb-2"
            >
              Slug
            </label>
            <input
              id="categorySlug"
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="category-slug"
              className="w-full px-4 py-2.5 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text)] font-mono text-xs placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] outline-none transition-colors"
            />
            <p className="font-mono text-[11px] text-[var(--color-text-muted)] mt-1.5">
              Auto-generated identifier used in URLs.
            </p>
          </div>

          {/* Active Category Toggle */}
          <div className="flex items-center justify-between p-4 bg-[var(--color-surface-secondary)]/50 rounded-[3px] border border-[var(--color-border)]">
            <div>
              <p className="font-mono text-xs font-semibold text-[var(--color-text)]">
                Active Category
              </p>
              <p className="font-mono text-[11px] text-[var(--color-text-muted)] mt-0.5">
                Enable for public article filtering and navigation
              </p>
            </div>

            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--color-surface)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)] relative border border-[var(--color-border)]"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)] font-mono text-xs">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-[3px] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-[3px] bg-[var(--color-primary)] hover:bg-[#7A4BC9] text-white font-semibold shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                  <span>Creating Category...</span>
                </>
              ) : (
                <>
                  <FiCheck size={14} />
                  <span>Create Category</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
