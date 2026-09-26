import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiSearch,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiHome,
  FiTag,
  FiShield,
  FiChevronDown,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userDropdownRef = useRef(null);

  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus when route changes (adjust state during render per React 19 guidelines)
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Left Navigation */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 group"
            >
              <div className="w-9 h-9 bg-primary-700 rounded-lg flex items-center justify-center p-1 shadow-xs group-hover:bg-primary-800 transition-colors flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="SharpStack Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-primary-600 transition-colors">
                SharpStack
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
              <Link
                to="/"
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/')
                    ? 'text-primary-600 bg-primary-50 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                }`}
              >
                Home
              </Link>
              <Link
                to="/categories"
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/categories')
                    ? 'text-primary-600 bg-primary-50 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                }`}
              >
                Categories
              </Link>
              {user && isAdmin() && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/admin')
                      ? 'text-primary-600 bg-primary-50 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-2"
            role="search"
          >
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiSearch size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-9 pr-8 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Clear search query"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>
          </form>

          {/* Right Area: User/Auth Actions & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center">
              {user ? (
                /* Authenticated User Menu */
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-all text-left"
                    aria-expanded={isUserDropdownOpen}
                    aria-haspopup="true"
                    aria-label="User account menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-xs shadow-xs flex-shrink-0">
                      {user.email ? (
                        user.email.charAt(0).toUpperCase()
                      ) : (
                        <FiUser size={14} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] lg:max-w-[160px] truncate hidden sm:inline">
                      {user.email}
                    </span>
                    <FiChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${
                        isUserDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-100 shadow-lg ring-1 ring-black/5 divide-y divide-gray-100 py-1 z-50 origin-top-right transition-all">
                      <div className="px-4 py-2.5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Signed in as
                        </p>
                        <p
                          className="text-sm font-medium text-gray-900 truncate mt-0.5"
                          title={user.email}
                        >
                          {user.email}
                        </p>
                        {isAdmin() ? (
                          <span className="inline-flex items-center px-2 py-0.5 mt-1.5 rounded text-[11px] font-medium bg-primary-50 text-primary-700 border border-primary-100">
                            Administrator
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 mt-1.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600">
                            Member
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        {isAdmin() && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                          >
                            <FiShield size={15} className="text-gray-400" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <Link
                          to="/categories"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        >
                          <FiTag size={15} className="text-gray-400" />
                          <span>Browse Categories</span>
                        </Link>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <FiLogOut size={15} className="text-red-500" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest Links */
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 rounded-lg transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-xs hover:shadow transition-all duration-150 active:scale-[0.98]"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-4 animate-in slide-in-from-top-1 duration-200">
            {/* Mobile Search Input */}
            <form onSubmit={handleSearch} className="relative" role="search">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiSearch size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-primary-600 bg-primary-50 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiHome
                  size={18}
                  className={isActive('/') ? 'text-primary-600' : 'text-gray-400'}
                />
                <span>Home</span>
              </Link>
              <Link
                to="/categories"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/categories')
                    ? 'text-primary-600 bg-primary-50 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiTag
                  size={18}
                  className={isActive('/categories') ? 'text-primary-600' : 'text-gray-400'}
                />
                <span>Categories</span>
              </Link>
              {user && isAdmin() && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin')
                      ? 'text-primary-600 bg-primary-50 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiShield
                    size={18}
                    className={isActive('/admin') ? 'text-primary-600' : 'text-gray-400'}
                  />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </nav>

            {/* Mobile User Section */}
            <div className="pt-3 border-t border-gray-100">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3.5 py-2.5 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-xs uppercase flex-shrink-0">
                      {user.email ? user.email.charAt(0).toUpperCase() : <FiUser size={14} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email}
                      </p>
                    </div>
                    {isAdmin() ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary-100 text-primary-700">
                        Admin
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">
                        Member
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <FiLogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-2.5 px-3 rounded-lg text-sm font-medium text-center text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-2.5 px-3 rounded-lg text-sm font-medium text-center text-white bg-primary-600 hover:bg-primary-700 shadow-xs transition-colors"
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
