import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 tracking-wider uppercase">
                About
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link to="/about" className="text-sm text-slate-600 hover:text-slate-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-slate-600 hover:text-slate-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-sm text-slate-600 hover:text-slate-900">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link to="/help" className="text-sm text-slate-600 hover:text-slate-900">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-sm text-slate-600 hover:text-slate-900">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-slate-600 hover:text-slate-900">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link to="/privacy" className="text-sm text-slate-600 hover:text-slate-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-sm text-slate-600 hover:text-slate-900">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/sitemap" className="text-sm text-slate-600 hover:text-slate-900">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 tracking-wider uppercase">
                Connect
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="https://twitter.com/ratemate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com/ratemate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/ratemate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-8">
            <p className="text-sm text-slate-500 text-center">
              &copy; {new Date().getFullYear()} RateMate. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 