/**
 * Footer component with modern, theme-aware design
 * Provides a consistent and responsive footer across all pages.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Mail, ChefHat } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const mainLinks = [
    { name: 'Recipes', href: '/app/recipes' },
    { name: 'Favorites', href: '/app/favorites' },
    { name: 'Create Recipe', href: '/app/recipes/create' },
    { name: 'Profile', href: '/app/profile' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  const socialLinks = [
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Email', href: '#', icon: Mail },
  ];

  return (
    <footer className="bg-secondary-100 dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-800 mt-auto print:hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and mission */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary-500 rounded-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900 dark:text-secondary-100">Recipe<span className="text-primary-500">Manager</span></span>
            </Link>
            <p className="text-secondary-700 dark:text-secondary-300 text-sm">
              Your culinary companion for discovering, creating, and sharing amazing recipes.
            </p>
          </div>

          {/* Main Links */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 tracking-wider uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              {mainLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-secondary-700 dark:text-secondary-300 hover:text-primary-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-secondary-700 dark:text-secondary-300 hover:text-primary-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 tracking-wider uppercase mb-4">
              Connect
            </h3>
            <div className="flex space-x-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-2 text-secondary-700 dark:text-secondary-300 hover:text-primary-500 hover:bg-secondary-200 dark:hover:bg-secondary-800 rounded-md transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-secondary-200 dark:border-secondary-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-secondary-700 dark:text-secondary-300">
            &copy; {currentYear} Recipe Manager. All rights reserved.
          </p>
          <p className="text-xs text-secondary-700 dark:text-secondary-300 mt-4 sm:mt-0">
            Designed with <span className="text-red-500">&hearts;</span> in San Francisco
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;