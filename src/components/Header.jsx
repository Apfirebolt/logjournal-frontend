'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  BookOpenIcon, 
  PencilSquareIcon, 
  TagIcon, 
  ChartBarIcon, 
  Bars3Icon, 
  XMarkIcon,
  SwatchIcon,
  CheckIcon
} from "@heroicons/react/24/outline";

const themes = [
  { id: 'light', name: 'Light Parchment' },
  { id: 'dark', name: 'Midnight Dark' },
  { id: 'neon', name: 'Neon Synthwave' },
  { id: 'argon', name: 'Argon Emerald' },
];

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('journal_theme') || 'dark';
    setCurrentTheme(savedTheme);
    applyThemeClass(savedTheme);
  }, []);

  // Handle theme application to document root
  const applyThemeClass = (themeName) => {
    const root = document.documentElement;
    // Remove all theme classes
    ['light', 'dark', 'neon', 'argon'].forEach((t) => root.classList.remove(t));
    // Add active theme class
    root.classList.add(themeName);
    localStorage.setItem('journal_theme', themeName);
  };

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    applyThemeClass(themeId);
    setIsThemeDropdownOpen(false);
  };

  // Close mobile menu and theme dropdown on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsThemeDropdownOpen(false);
  }, [pathname]);

  // Close theme dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        opacity: 0.95
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              <BookOpenIcon className="h-5 w-5" />
            </div>
            <span className="text-xl sm:text-2xl font-bold font-theme-heading tracking-tight"
              style={{ color: 'var(--text-main)' }}
            >
              Log<span style={{ color: 'var(--accent)' }}>Journal</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-2 font-theme-body">
            <li>
              <Link 
                href="/" 
                className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all whitespace-nowrap ${
                  pathname === '/' 
                    ? 'shadow-sm' 
                    : 'opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={pathname === '/' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
              >
                <HomeIcon className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/journal/new" 
                className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all whitespace-nowrap ${
                  pathname === '/journal/new' 
                    ? 'shadow-sm' 
                    : 'opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={pathname === '/journal/new' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
              >
                <PencilSquareIcon className="h-4 w-4" />
                <span>New Entry</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/journal/entries" 
                className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all whitespace-nowrap ${
                  pathname.startsWith('/journal/entries') 
                    ? 'shadow-sm' 
                    : 'opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={pathname.startsWith('/journal/entries') ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
              >
                <BookOpenIcon className="h-4 w-4" />
                <span>My Entries</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/journal/categories" 
                className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all whitespace-nowrap ${
                  pathname === '/journal/categories' 
                    ? 'shadow-sm' 
                    : 'opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={pathname === '/journal/categories' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
              >
                <TagIcon className="h-4 w-4" />
                <span>Categories</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/journal/analytics" 
                className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all whitespace-nowrap ${
                  pathname === '/journal/analytics' 
                    ? 'shadow-sm' 
                    : 'opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={pathname === '/journal/analytics' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
              >
                <ChartBarIcon className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Side: Theme Switcher Dropdown & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          
          {/* Multi-Theme Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className="p-2.5 rounded-xl border flex items-center gap-2 transition-all shadow-sm hover:scale-105"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)'
              }}
              aria-label="Select theme"
            >
              <SwatchIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">
                {currentTheme}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isThemeDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-2xl shadow-xl border py-2 z-50 backdrop-blur-lg animate-in fade-in slide-in-from-top-2"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--text-muted)' }}>
                  Choose Theme
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: 'var(--text-main)' }}
                  >
                    <span>{t.name}</span>
                    {currentTheme === t.id && (
                      <CheckIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl transition-colors"
            style={{ color: 'var(--text-main)' }}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" style={{ color: 'var(--accent)' }} />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
            style={pathname === '/' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
          >
            <HomeIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          
          <Link
            href="/journal/new"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
            style={pathname === '/journal/new' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
          >
            <PencilSquareIcon className="h-5 w-5" />
            <span>New Entry</span>
          </Link>

          <Link
            href="/journal/entries"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
            style={pathname.startsWith('/journal/entries') ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
          >
            <BookOpenIcon className="h-5 w-5" />
            <span>My Entries</span>
          </Link>

          <Link
            href="/journal/categories"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
            style={pathname === '/journal/categories' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
          >
            <TagIcon className="h-5 w-5" />
            <span>Categories</span>
          </Link>

          <Link
            href="/journal/analytics"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
            style={pathname === '/journal/analytics' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>Analytics</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;