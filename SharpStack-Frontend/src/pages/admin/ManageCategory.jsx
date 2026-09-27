import { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import toast from 'react-hot-toast';
import { FiTag, FiPlus, FiCheck, FiFolder } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ManageCategory() {
  const [categories, setCategories] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setListLoading(true);
      const data = await categoryService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load categories', error);
    } finally {
      setListLoading(false);
    }
  };

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

      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(error.response?.data?.message || 'Error creating category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="pb-6 border-b border-[var(--color-border)]">
        <div className="font-mono text-xs font-semibold tracking-widest text-[var(--color-primary)] uppercase mb-2">
          — TOPICS & DOMAINS
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--color-text)] tracking-tight">
          Categories
        </h1>
        <p className="font-serif text-base text-[var(--color-text-muted)] mt-2 leading-relaxed">
          Organize your engineering publications and articles into topics and domains.
        </p>
      </div>

      {/* 2-COLUMN RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CREATE CATEGORY FORM (5 cols on lg) */}
        <div className="lg:col-span-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] p-6 sm:p-7 space-y-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--color-border)]">
            <div className="w-8 h-8 rounded-[3px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 flex items-center justify-center font-mono">
              <FiPlus size={16} />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[var(--color-text)]">Create Category</h2>
              <p className="font-serif text-xs text-[var(--color-text-muted)]">Add a new topic for your articles</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category Name */}
            <div>
              <label htmlFor="categoryName" className="block font-mono text-xs font-semibold tracking-wider text-[var(--color-text-muted)] uppercase mb-2">
                Category Name <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                id="categoryName"
                type="text"
                value={form.name}
                onChange={handleNameChange}
                placeholder="e.g. ASP.NET Core, DevOps, Architecture"
                className="w-full px-4 py-2.5 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] outline-none transition-colors"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="categorySlug" className="block font-mono text-xs font-semibold tracking-wider text-[var(--color-text-muted)] uppercase mb-2">
                URL Slug
              </label>
              <input
                id="categorySlug"
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. asp-net-core"
                className="w-full px-4 py-2.5 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text)] font-mono text-xs placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] outline-none transition-colors"
              />
              <p className="font-mono text-[11px] text-[var(--color-text-muted)] mt-1.5">
                Auto-generated identifier used in URLs.
              </p>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-[var(--color-surface-secondary)]/50 rounded-[3px] border border-[var(--color-border)]">
              <div>
                <p className="font-mono text-xs font-semibold text-[var(--color-text)]">Active Category</p>
                <p className="font-mono text-[11px] text-[var(--color-text-muted)]">Available for public filtering</p>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[3px] bg-[var(--color-primary)] hover:bg-[#7A4BC9] text-white font-mono text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
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
          </form>
        </div>

        {/* EXISTING CATEGORIES LIST (7 cols on lg) */}
        <div className="lg:col-span-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[4px] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[3px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 flex items-center justify-center font-mono">
                <FiTag size={16} />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-[var(--color-text)]">Existing Categories</h2>
                <p className="font-serif text-xs text-[var(--color-text-muted)]">Currently registered topics</p>
              </div>
            </div>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
              {categories.length} total
            </span>
          </div>

          {listLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="medium" />
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-text-muted)]">
              <FiFolder size={28} className="mx-auto mb-2 opacity-40" />
              <p className="font-serif text-sm text-[var(--color-text)]">No categories found</p>
              <p className="font-serif text-xs text-[var(--color-text-muted)] mt-1">Use the form on the left to add your first category.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 font-mono text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">
                    <th className="px-5 py-3.5 font-semibold">Category Name</th>
                    <th className="px-5 py-3.5 font-semibold">Slug</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]/60 font-mono text-xs">
                  {categories.map((cat) => (
                    <tr key={cat.id || cat.slug} className="hover:bg-[var(--color-surface-secondary)]/30 transition-colors">
                      <td className="px-5 py-3.5 font-serif font-semibold text-[var(--color-text)]">
                        {cat.name}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-[11px] font-semibold tracking-wide text-[var(--color-primary)] uppercase">
                          [ {cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-')} ]
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-[2px] bg-[#7EC98F]/10 text-[#7EC98F] border border-[#7EC98F]/30 uppercase font-semibold">
                          <span>✓</span>
                          <span>ACTIVE</span>
                        </span>
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
}
