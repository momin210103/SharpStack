import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiRss, FiMail } from 'react-icons/fi';
import categoryService from '../../services/categoryService';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService
      .getAll()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setCategories(data.slice(0, 6));
        }
      })
      .catch((error) => {
        console.error('Failed to load categories in footer:', error);
      });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] font-mono transition-colors">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* 4-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* 1. BRAND AREA */}
          <div className="lg:col-span-5 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center font-mono font-bold text-lg tracking-tight select-none group focus:outline-none"
            >
              <span className="text-[var(--violet)] text-2xl font-bold mr-0.5 group-hover:scale-110 transition-transform">
                #
              </span>
              <span className="text-[var(--ink)] group-hover:text-[var(--violet)] transition-colors">
                SharpStack
              </span>
            </Link>

            <p className="font-serif text-sm text-[var(--muted)] leading-relaxed max-w-sm">
              Developer knowledge, practical solutions, and engineering insights for modern developers.
            </p>

            {/* Subscribe Section (Visual Static CTA) */}
            <div className="pt-2">
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="your.email@domain.com"
                  readOnly
                  aria-label="Newsletter email input"
                  className="bg-[var(--panel)] border border-[var(--line)] rounded-[3px] px-3 py-1.5 font-mono text-xs text-[var(--ink)] placeholder-[var(--muted)]/60 focus:outline-none w-full cursor-not-allowed select-none"
                />
                <button
                  type="button"
                  aria-label="Subscribe to newsletter"
                  className="px-3.5 py-1.5 bg-[var(--violet)] hover:bg-[#7A4BC9] text-white font-mono text-xs font-semibold rounded-[3px] transition-colors shrink-0 shadow-xs"
                >
                  Subscribe
                </button>
              </div>
              <p className="font-mono text-[11px] text-[var(--muted)] mt-1.5 select-none">
                // one email a week, unsubscribe anytime
              </p>
            </div>
          </div>

          {/* 2. NAVIGATE */}
          <div className="lg:col-span-2 space-y-3">
            <p className="font-mono text-xs text-[var(--muted)] font-medium select-none tracking-wide">
              // navigate
            </p>
            <ul className="space-y-2.5 font-mono text-xs">
              <li>
                <Link
                  to="/"
                  className="text-[var(--muted)] hover:text-[var(--violet)] transition-colors inline-block"
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-[var(--muted)] hover:text-[var(--violet)] transition-colors inline-block"
                >
                  Topics
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-[var(--muted)] hover:text-[var(--violet)] transition-colors inline-block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-[var(--muted)] hover:text-[var(--violet)] transition-colors inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-[var(--muted)] hover:text-[var(--violet)] transition-colors inline-block"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. TOPICS */}
          <div className="lg:col-span-3 space-y-3">
            <p className="font-mono text-xs text-[var(--muted)] font-medium select-none tracking-wide">
              // topics
            </p>
            <ul className="space-y-2.5 font-mono text-xs">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <li key={`${category.id ?? category.name}-${index}`}>
                    <Link
                      to={`/categories`}
                      className="text-[var(--muted)] hover:text-[var(--violet)] transition-colors inline-block"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link
                      to="/categories"
                      className="text-[var(--muted)] hover:text-[var(--violet)] transition-colors inline-block"
                    >
                      .NET & C#
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categories"
                      className="text-[var(--muted)] hover:text-[var(--violet)] transition-colors inline-block"
                    >
                      Architecture
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categories"
                      className="text-[var(--muted)] hover:text-[var(--violet)] transition-colors inline-block"
                    >
                      Database & ORM
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categories"
                      className="text-[var(--muted)] hover:text-[var(--violet)] transition-colors inline-block"
                    >
                      DevOps & Cloud
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* 4. CONNECT */}
          <div className="lg:col-span-2 space-y-3">
            <p className="font-mono text-xs text-[var(--muted)] font-medium select-none tracking-wide">
              // connect
            </p>
            <ul className="space-y-2.5 font-mono text-xs">
              <li>
                <a
                  href="https://github.com/momin210103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--violet)] transition-colors"
                >
                  <FiGithub size={13} />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/momin210103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--violet)] transition-colors"
                >
                  <FiLinkedin size={13} />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href="/rss.xml"
                  className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--violet)] transition-colors"
                  title="RSS Feed (Placeholder)"
                >
                  <FiRss size={13} />
                  <span>RSS Feed</span>
                </a>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--violet)] transition-colors"
                >
                  <FiMail size={13} />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-[var(--line)] mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[var(--muted)]">
          <p>© {currentYear} SharpStack. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 hover:text-[var(--violet)] transition-colors focus:outline-none group cursor-pointer"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <span className="group-hover:-translate-y-0.5 transition-transform" aria-hidden="true">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

