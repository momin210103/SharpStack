import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiSearch,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiShield,
  FiTag,
  FiChevronDown,
  FiSun,
  FiMoon,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sharpstack-theme') || 'dark';
    }
    return 'dark';
  });

  const userDropdownRef = useRef(null);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('sharpstack-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    setCurrentTheme(saved);
  }, []);

  // Close menus when route changes
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  }

  // Handle clicking outside user dropdown and escape key press
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsUserDropdownOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Theme toggle helper
  const toggleTheme = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('sharpstack-theme', nextTheme);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-border)] text-[var(--color-text)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-6">
          {/* LEFT: BRAND */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link
              to="/"
              className="flex items-center gap-1.5 font-mono font-bold text-lg sm:text-xl tracking-tight text-[var(--color-text)] group focus:outline-none select-none"
            >
              <span className="text-[var(--color-primary)] text-2xl font-black transition-transform group-hover:scale-110">
                #
              </span>
              <span className="font-bold tracking-tight group-hover:text-[var(--color-primary)] transition-colors">
                SharpStack
              </span>
            </Link>

            {/* DESKTOP NAVIGATION LINKS */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 font-mono text-xs" aria-label="Main Navigation">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-[3px] transition-colors ${
                  isActive('/')
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-semibold'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)]'
                }`}
              >
                Articles
              </Link>
              <Link
                to="/categories"
                className={`px-3 py-1.5 rounded-[3px] transition-colors ${
                  isActive('/categories')
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-semibold'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)]'
                }`}
              >
                Topics
              </Link>
              <Link
                to="/about"
                className={`px-3 py-1.5 rounded-[3px] transition-colors ${
                  isActive('/about')
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-semibold'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)]'
                }`}
              >
                About
              </Link>
              {user && isAdmin() && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-[3px] transition-colors ${
                    isActive('/admin')
                      ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-semibold'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* CENTER & RIGHT CONTROLS */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 flex-1 justify-end max-w-xl">
            {/* SEARCH FIELD */}
            <form
              onSubmit={handleSearch}
              className="relative flex items-center w-48 lg:w-64"
              role="search"
            >
              <FiSearch
                size={13}
                className="absolute left-2.5 text-[var(--color-text-muted)] pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full h-8 pl-8 pr-7 text-xs font-mono bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3px] text-[var(--color-text)] placeholder-[var(--color-text-muted)]/70 focus:outline-none focus:border-[var(--color-primary)] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] focus:outline-none"
                  aria-label="Clear search"
                >
                  <FiX size={12} />
                </button>
              )}
            </form>

            {/* THEME TOGGLE BUTTON */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
              className="h-8 w-8 flex items-center justify-center rounded-[3px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary-muted)] transition-colors focus:outline-none shrink-0"
            >
              {currentTheme === 'dark' ? <FiSun size={13} /> : <FiMoon size={13} />}
            </button>

            {/* USER MENU / AUTH ACTIONS */}
            <div className="flex items-center shrink-0">
              {user ? (
                /* Authenticated User Menu: ● User ▼ */
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 h-8 px-2.5 rounded-[3px] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary-muted)] focus:outline-none transition-colors text-left font-mono text-xs"
                    aria-expanded={isUserDropdownOpen}
                    aria-haspopup="true"
                    aria-label="User account menu"
                  >
                    <span className="w-2 h-2 rounded-full bg-[var(--color-success)] shrink-0" />
                    <span className="font-mono text-xs text-[var(--color-text)] max-w-[120px] lg:max-w-[150px] truncate">
                      {user.email}
                    </span>
                    <FiChevronDown
                      size={12}
                      className={`text-[var(--color-text-muted)] transition-transform duration-200 ${
                        isUserDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-56 rounded-[3px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl divide-y divide-[var(--color-border)] py-1 z-50 origin-top-right transition-all font-mono">
                      <div className="px-3.5 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                          Signed in as
                        </p>
                        <p
                          className="text-xs font-semibold text-[var(--color-text)] truncate mt-0.5"
                          title={user.email}
                        >
                          {user.email}
                        </p>
                        <div className="mt-1.5">
                          {isAdmin() ? (
                            <span className="inline-block text-[10px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary-muted)]/20 px-1.5 py-0.5 rounded-[2px] border border-[var(--color-primary-muted)]/40">
                              ADMINISTRATOR
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-secondary)] px-1.5 py-0.5 rounded-[2px]">
                              MEMBER
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="py-1 text-xs">
                        {isAdmin() && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-1.5 text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors"
                          >
                            <FiShield size={13} className="text-[var(--color-text-muted)]" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <Link
                          to="/categories"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-1.5 text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors"
                        >
                          <FiTag size={13} className="text-[var(--color-text-muted)]" />
                          <span>Browse Topics</span>
                        </Link>
                      </div>

                      <div className="py-1 text-xs">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3.5 py-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <FiLogOut size={13} />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest Auth Links */
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 bg-[var(--color-primary)] hover:bg-[#7A4BC9] text-white font-medium rounded-[3px] transition-colors shadow-xs"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE CONTROLS */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 rounded-[3px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors focus:outline-none"
            >
              {currentTheme === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
            </button>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 rounded-[3px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[var(--color-border)] py-4 space-y-4 font-mono text-xs animate-in slide-in-from-top-1 duration-150">
            {/* Mobile Search Input */}
            <form onSubmit={handleSearch} className="relative" role="search">
              <FiSearch
                size={14}
                className="absolute inset-y-0 left-3 my-auto text-[var(--color-text-muted)] pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-9 pr-8 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3px] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-2.5 my-auto text-[var(--color-text-muted)] hover:text-[var(--color-text)] focus:outline-none"
                  aria-label="Clear search query"
                >
                  <FiX size={14} />
                </button>
              )}
            </form>

            {/* Mobile Nav Links */}
            <nav className="space-y-1" aria-label="Mobile Navigation">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-[3px] transition-colors ${
                  isActive('/')
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-semibold'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                }`}
              >
                Articles
              </Link>
              <Link
                to="/categories"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-[3px] transition-colors ${
                  isActive('/categories')
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-semibold'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                }`}
              >
                Topics
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-[3px] transition-colors ${
                  isActive('/about')
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-semibold'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                }`}
              >
                About
              </Link>
              {user && isAdmin() && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-[3px] transition-colors ${
                    isActive('/admin')
                      ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-semibold'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>

            {/* Mobile User Section */}
            <div className="pt-3 border-t border-[var(--color-border)]">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase text-[var(--color-text-muted)]">Signed in as</p>
                      <p className="text-xs font-semibold text-[var(--color-text)] truncate">
                        {user.email}
                      </p>
                    </div>
                    {isAdmin() ? (
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-[2px] bg-[var(--color-primary-muted)]/20 text-[var(--color-primary)] border border-[var(--color-primary-muted)]/40">
                        Admin
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-medium px-1.5 py-0.5 rounded-[2px] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]">
                        Member
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[3px] text-xs font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  >
                    <FiLogOut size={14} />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-2 px-3 rounded-[3px] text-xs font-medium text-center text-[var(--color-text)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-secondary)] transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-2 px-3 rounded-[3px] text-xs font-medium text-center text-white bg-[var(--color-primary)] hover:bg-[#7A4BC9] transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
