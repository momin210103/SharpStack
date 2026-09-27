import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiFileText,
  FiTag,
  FiLogOut,
  FiMenu,
  FiX,
  FiExternalLink,
} from 'react-icons/fi';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/posts', icon: FiFileText, label: 'Posts' },
    { path: '/admin/categories', icon: FiTag, label: 'Categories' },
    { path: '/', icon: FiExternalLink, label: 'View Site' },
  ];

  const isActive = (itemPath) => {
    if (itemPath === '/') return false;
    if (itemPath === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col lg:flex-row transition-colors selection:bg-[var(--color-primary)] selection:text-white">
      {/* Mobile Top Navigation Header (< lg) */}
      <header className="lg:hidden sticky top-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)] px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded-[3px] transition-colors"
            aria-label="Open navigation menu"
          >
            <FiMenu size={18} />
          </button>
          <Link
            to="/admin"
            className="flex items-center font-mono font-bold text-base tracking-tight select-none"
          >
            <span className="text-[var(--color-primary)] mr-1 font-bold">#</span>
            <span className="text-[var(--color-text)]">SharpStack</span>
            <span className="ml-2 font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-primary)] font-semibold">
              Admin
            </span>
          </Link>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 rounded-[3px] transition-colors"
        >
          <FiExternalLink size={12} />
          <span className="hidden sm:inline">View Site</span>
        </Link>
      </header>

      {/* Sidebar (Desktop Sticky / Mobile Off-canvas Drawer) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:z-30
          ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header & Navigation */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo / Brand Header */}
          <div className="p-5 sm:p-6 border-b border-[var(--color-border)] flex items-center justify-between">
            <Link
              to="/admin"
              className="flex items-center font-mono font-bold text-lg tracking-tight select-none group"
            >
              <span className="text-[var(--color-primary)] text-xl font-bold mr-1 group-hover:scale-110 transition-transform">
                #
              </span>
              <span className="text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                SharpStack
              </span>
              <span className="ml-2.5 font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-primary)] font-semibold">
                Console
              </span>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] rounded-[3px] transition-colors"
              aria-label="Close sidebar"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-5 flex-1 overflow-y-auto">
            <div className="px-3 pb-2 font-mono text-[10px] font-semibold tracking-widest text-[var(--color-text-muted)] uppercase">
              NAVIGATION
            </div>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[3px] font-mono text-xs transition-all duration-150 ${
                      active
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)]/20 shadow-xs'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] border border-transparent'
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
                      }
                    />
                    <span className="tracking-tight">{item.label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer: User Profile & Logout */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] space-y-3">
          {/* User Profile */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-[3px] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center font-mono text-xs font-bold text-[var(--color-primary)] uppercase shrink-0">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-semibold text-[var(--color-text)] truncate">
                {user?.email ? user.email.split('@')[0] : 'Admin User'}
              </p>
              <p className="font-mono text-[10px] text-[var(--color-text-muted)] truncate">
                {user?.email || 'admin@sharpstack.dev'}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[3px] font-mono text-xs text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
          >
            <FiLogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Backdrop Overlay for Mobile Drawer */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 min-h-screen bg-[var(--color-bg)] overflow-x-hidden">
        <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
