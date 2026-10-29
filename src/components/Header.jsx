'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  HomeIcon, 
  BookOpenIcon, 
  PencilSquareIcon, 
  TagIcon, 
  ChartBarIcon, 
  BellIcon,
  Bars3Icon, 
  XMarkIcon,
  SwatchIcon,
  CheckIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon
} from "@heroicons/react/24/outline";

const themes = [
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Midnight' },
  { id: 'neon', name: 'Neon' },
  { id: 'argon', name: 'Argon' },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, initializeAuth, logout } = useAuthStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const themeDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Initialize auth session and theme on mount
  useEffect(() => {
    initializeAuth();
    const savedTheme = localStorage.getItem('journal_theme') || 'dark';
    setCurrentTheme(savedTheme);
    applyThemeClass(savedTheme);
  }, [initializeAuth]);

  // Handle theme application to document root
  const applyThemeClass = (themeName) => {
    const root = document.documentElement;
    ['light', 'dark', 'neon', 'argon'].forEach((t) => root.classList.remove(t));
    root.classList.add(themeName);
    localStorage.setItem('journal_theme', themeName);
  };

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    applyThemeClass(themeId);
    setIsThemeDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    router.push('/login');
  };

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsThemeDropdownOpen(false);
    setIsUserDropdownOpen(false);
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
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
            <span className="text-3xl sm:text-3xl font-bold font-theme-heading tracking-tight"
              style={{ color: 'var(--text-main)' }}
            >
              Softgenie <span style={{ color: 'var(--accent)' }}>Journal</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-2 font-theme-body">

            {/* Only authenticated users can write and view entries/analytics/notifications */}
            {isAuthenticated && (
              <>
                <li>
                  <Link 
                    href="/" 
                    className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
                      pathname === '/' ? 'shadow-sm' : 'opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
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
                    className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
                      pathname === '/journal/new' ? 'shadow-sm' : 'opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
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
                    className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
                      pathname.startsWith('/journal/entries') ? 'shadow-sm' : 'opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    style={pathname.startsWith('/journal/entries') ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
                  >
                    <BookOpenIcon className="h-4 w-4" />
                    <span>My Entries</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/categories" 
                    className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
                      pathname === '/categories' ? 'shadow-sm' : 'opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    style={pathname === '/categories' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
                  >
                    <TagIcon className="h-4 w-4" />
                    <span>Categories</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/analytics" 
                    className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
                      pathname === '/analytics' ? 'shadow-sm' : 'opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    style={pathname === '/analytics' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
                  >
                    <ChartBarIcon className="h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Right Side: Theme Switcher, User Profile/Auth, & Mobile Menu */}
        <div className="flex items-center gap-3">
          
          {/* Multi-Theme Selector Dropdown */}
          <div className="relative" ref={themeDropdownRef}>
            <button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className="p-2.5 rounded-xl border flex items-center gap-2 transition-all shadow-sm hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)'
              }}
              aria-label="Select theme"
            >
              <SwatchIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              <span className="hidden sm:inline font-semibold uppercase tracking-wider text-sm">
                {currentTheme}
              </span>
            </button>

            {isThemeDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-2xl shadow-xl border py-2 z-50 backdrop-blur-lg"
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
                    className="w-full text-sm text-left px-4 py-2.5 font-medium flex items-center justify-between transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
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

          {/* User Authentication Status / Profile Dropdown */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all shadow-sm hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)'
                }}
              >
                {user.profile_image ? (
                  <img src={user.profile_image} alt="Avatar" className="w-6 h-6 rounded-full object-cover border" style={{ borderColor: 'var(--accent)' }} />
                ) : (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                  >
                    {(user.username || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="font-medium max-w-[120px] truncate">
                  {user.username || user.email}
                </span>
              </button>

              {isUserDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl border py-2 z-50 backdrop-blur-lg"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-50" style={{ color: 'var(--text-muted)' }}>Signed in as</p>
                    <p className="font-semibold truncate" style={{ color: 'var(--text-main)' }}>{user.username || user.email}</p>
                  </div>

                  <Link
                    href="/settings"
                    className="w-full text-left px-4 py-2.5 font-medium flex items-center gap-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: 'var(--text-main)' }}
                  >
                    <Cog6ToothIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                    <span>Profile Settings</span>
                  </Link>

                  <Link
                    href="/notifications"
                    className="w-full text-left px-4 py-2.5 font-medium flex items-center gap-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: 'var(--text-main)' }}
                  >
                    <BellIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                    <span>Notifications</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 font-medium flex items-center gap-2 text-rose-500 hover:bg-rose-500/10 transition-colors mt-1 cursor-pointer"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 font-semibold rounded-xl border transition-all hover:opacity-100 opacity-80"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 font-semibold rounded-xl transition-all shadow-sm hover:opacity-90"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)',
                }}
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl transition-colors cursor-pointer"
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
        <div className="md:hidden border-b px-4 py-4 space-y-2 shadow-2xl"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          {isAuthenticated && user && (
            <div className="px-4 py-3 rounded-xl mb-2 flex items-center gap-3 border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
              {user.profile_image ? (
                <img src={user.profile_image} alt="Avatar" className="w-8 h-8 rounded-full object-cover border" style={{ borderColor: 'var(--accent)' }} />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  {(user.username || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-50" style={{ color: 'var(--text-muted)' }}>Signed in as</p>
                <p className="font-semibold truncate" style={{ color: 'var(--text-main)' }}>{user.username || user.email}</p>
              </div>
            </div>
          )}

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors"
            style={pathname === '/' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
          >
            <HomeIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                href="/journal/new"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors"
                style={pathname === '/journal/new' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
              >
                <PencilSquareIcon className="h-5 w-5" />
                <span>New Entry</span>
              </Link>

              <Link
                href="/journal/entries"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors"
                style={pathname.startsWith('/journal/entries') ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
              >
                <BookOpenIcon className="h-5 w-5" />
                <span>My Entries</span>
              </Link>

              <Link
                href="/categories"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors"
                style={pathname === '/categories' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
              >
                <TagIcon className="h-5 w-5" />
                <span>Categories</span>
              </Link>

              <Link
                href="/analytics"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors"
                style={pathname === '/analytics' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
              >
                <ChartBarIcon className="h-5 w-5" />
                <span>Analytics</span>
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors"
                style={pathname === '/settings' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
              >
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Profile Settings</span>
              </Link>

              <Link
                href="/notifications"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors"
                style={pathname === '/notifications' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
              >
                <BellIcon className="h-5 w-5" />
                <span>Notifications</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-500 hover:bg-rose-500/10 transition-colors pt-2 cursor-pointer"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium border transition-colors"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors shadow-sm"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                <UserIcon className="h-4 w-4" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;