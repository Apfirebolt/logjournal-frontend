'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HomeIcon, BookOpenIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div 
      className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-main)',
      }}
    >
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="max-w-xl w-full text-center space-y-8 relative">
          
          {/* Subtle background glow effect */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 blur-[100px] rounded-full pointer-events-none opacity-20"
            style={{ backgroundColor: 'var(--accent)' }}
          />

          {/* Icon Badge */}
          <div 
            className="relative z-10 w-20 h-20 mx-auto rounded-2xl border flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--accent)',
            }}
          >
            <ExclamationTriangleIcon className="h-10 w-10" />
          </div>

          {/* Heading & Error Code */}
          <div className="relative z-10 space-y-3">
            <span 
              className="text-xs font-mono tracking-widest uppercase font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              Error 404
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-theme-heading tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm sm:text-base max-w-md mx-auto leading-relaxed opacity-80" style={{ color: 'var(--text-muted)' }}>
              Oops! The journal entry, category, or page you are looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-semibold font-theme-heading transition-all shadow-md flex items-center justify-center gap-2 hover:scale-105"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)',
              }}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>

            <Link
              href="/journal/entries"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-semibold font-theme-heading border transition-all flex items-center justify-center gap-2 shadow-sm hover:opacity-100 opacity-80"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
              }}
            >
              <BookOpenIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              <span>My Entries</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;