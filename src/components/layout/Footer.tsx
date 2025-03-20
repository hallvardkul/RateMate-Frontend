import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                About
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-base text-gray-500 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/help" className="text-base text-gray-500 hover:text-gray-900">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-base text-gray-500 hover:text-gray-900">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-base text-gray-500 hover:text-gray-900">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/sitemap" className="text-base text-gray-500 hover:text-gray-900">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Connect
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="https://twitter.com/ratemate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com/ratemate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/ratemate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} RateMate. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 