import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Shield, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Explore Events', href: '/events' },
    { name: 'About System', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center space-x-3 text-slate-900 group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-sm"
          >
            <div className="w-9 h-9 bg-slate-900 text-white flex items-center justify-center rounded-md font-bold tracking-tight shadow-xs transition-transform group-hover:scale-102">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">EVENTFLOW</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded-xs border border-stone-200">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium leading-none">
                Event Registration & Management Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            <Link
              to="/events"
              className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/events')
                  ? 'bg-stone-100 text-slate-900'
                  : 'text-stone-600 hover:text-slate-900 hover:bg-stone-50'
              }`}
            >
              Explore Events
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/about')
                  ? 'bg-stone-100 text-slate-900'
                  : 'text-stone-600 hover:text-slate-900 hover:bg-stone-50'
              }`}
            >
              About System
            </Link>
          </nav>

          {/* Action Area & Admin Entry */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin: {user?.username}</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-stone-500 hover:text-slate-800 rounded-md transition-colors"
                title="Administrator Sign-In"
              >
                <Shield className="w-3.5 h-3.5 text-stone-400" />
                <span>Admin Portal</span>
              </Link>
            )}

            <Link
              to="/events"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-md shadow-xs transition-colors"
            >
              <span>Register for Event</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-slate-900 hover:bg-stone-100 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 text-base font-medium rounded-md ${
              isActive('/events')
                ? 'bg-stone-100 text-slate-900 font-semibold'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            Explore Events
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 text-base font-medium rounded-md ${
              isActive('/about')
                ? 'bg-stone-100 text-slate-900 font-semibold'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            About System
          </Link>
          <div className="pt-3 border-t border-stone-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-sm font-medium text-teal-800 bg-teal-50 border border-teal-200 rounded-md"
              >
                <span>Dashboard ({user?.username})</span>
                <Shield className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 rounded-md border border-stone-200"
              >
                <span>Administrator Sign-in</span>
                <Shield className="w-4 h-4 text-stone-400" />
              </Link>
            )}
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-md shadow-xs"
            >
              <span>Browse All Events</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
