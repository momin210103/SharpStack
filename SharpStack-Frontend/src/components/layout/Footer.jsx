import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                {/* <span className="text-white font-bold text-xl">B</span> */}
                <img src="/public/logo.png" alt="Logo" className="h-10 w-10 rounded-full"/>
              </div>
              <span className="text-2xl font-bold text-white">SharpStack</span>
            </div>
            <p className="text-gray-400 mb-4">
              A learning platform to share knowledge and grow together.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/momin210103" className="hover:text-primary-400 transition-colors">
                <FiGithub size={20} />
              </a>
              <a href="https://www.facebook.com/momin.pust.cse" className="hover:text-primary-400 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="https://www.linkedin.com/in/momin210103" className="hover:text-primary-400 transition-colors">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-primary-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} SharpStack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
