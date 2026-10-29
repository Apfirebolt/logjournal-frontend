'use client';

import Link from 'next/link';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer 
      className="border-t transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-main)',
      }}
    >
      <div className="container mx-auto px-6 pt-12 pb-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div 
                className="p-1.5 rounded-lg transition-transform group-hover:scale-105"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                <BookOpenIcon className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold font-theme-heading tracking-tight" style={{ color: 'var(--text-main)' }}>
                Softgenie <span style={{ color: 'var(--accent)' }}> Journal</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed font-theme-body opacity-80 max-w-sm" style={{ color: 'var(--text-muted)' }}>
              A flexible daily journaling and self-reflection platform with custom categories, block-based prompts, and category ratings.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 font-theme-body">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--text-main)' }}>
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="transition-opacity opacity-80 hover:opacity-100">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/journal/new" className="transition-opacity opacity-80 hover:opacity-100">
                  New Journal Entry
                </Link>
              </li>
              <li>
                <Link href="/journal/entries" className="transition-opacity opacity-80 hover:opacity-100">
                  My Entries
                </Link>
              </li>
              <li>
                <Link href="/journal/categories" className="transition-opacity opacity-80 hover:opacity-100">
                  Categories & Tags
                </Link>
              </li>
            </ul>
          </div>

          {/* System & Analytics Links */}
          <div className="space-y-3 font-theme-body">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--text-main)' }}>
              Insights & Source
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/analytics" className="transition-opacity opacity-80 hover:opacity-100">
                  Rating Analytics
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-opacity opacity-80 hover:opacity-100"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div 
          className="border-t pt-6 mt-6 flex flex-col md:flex-row justify-between items-center text-xs font-theme-body gap-4 opacity-75"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
        >
          <p>&copy; {new Date().getFullYear()} Softgenie Journal Platform. All rights reserved.</p>
          
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:opacity-100 transition-opacity">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:opacity-100 transition-opacity">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;