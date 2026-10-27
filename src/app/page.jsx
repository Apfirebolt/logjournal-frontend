'use client';

import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  SparklesIcon, 
  PencilSquareIcon, 
  TagIcon, 
  ChartBarIcon, 
  ArrowRightIcon, 
  BookOpenIcon,
  LightBulbIcon
} from "@heroicons/react/24/outline";

export default function Home() {
  const { user, isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-main)',
      }}
    >
      <Header />

      <main className="flex-grow">
        {/* Hero Section with Unsplash Background Image */}
        <section className="relative overflow-hidden py-24 lg:py-36 px-6 flex items-center justify-center">
          {/* Unsplash Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=2070&q=80" 
              alt="Journaling and coffee background" 
              className="w-full h-full object-cover object-center transform scale-105 filter brightness-75 dark:brightness-50"
            />
            {/* Gradient / Dark Readability Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 backdrop-blur-[2px]" />
          </div>

          {/* Subtle background glow effect using theme accent */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none opacity-30 z-0"
            style={{ backgroundColor: 'var(--accent)' }}
          />

          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
            <div 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium backdrop-blur-md shadow-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff'
              }}
            >
              <SparklesIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              <span>{isAuthenticated && user ? `Welcome back, ${user.name || user.email || 'Friend'}!` : 'Mindfulness & Productivity Combined'}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-theme-heading tracking-tight leading-tight text-white drop-shadow-md">
              Capture Your Days, <span style={{ color: 'var(--accent)' }}>Reflect & Grow.</span>
            </h1>

            <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-gray-200 drop-shadow">
              A flexible daily journal powered by custom categories, block-based rich text prompts, and daily category ratings to help you understand your patterns.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/journal/new"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold font-theme-heading transition-all shadow-xl flex items-center justify-center gap-2 group hover:scale-105"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)',
                }}
              >
                <PencilSquareIcon className="h-5 w-5" />
                <span>Write Today's Entry</span>
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/journal/entries"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold font-theme-heading border transition-all flex items-center justify-center gap-2 backdrop-blur-md text-white hover:bg-white/10"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }}
              >
                <BookOpenIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                <span>Browse Past Entries</span>
              </Link>

              {isAuthenticated && (
                <Link
                  href="/journal/analytics"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold font-theme-heading border transition-all flex items-center justify-center gap-2 backdrop-blur-md text-white hover:bg-white/10"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <ChartBarIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                  <span>View Analytics</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features / Architecture Highlights Section */}
        <section 
          className="py-20 px-6 border-t transition-colors"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold font-theme-heading">
                Designed for Daily Reflection
              </h2>
              <p className="max-w-xl mx-auto opacity-80" style={{ color: 'var(--text-muted)' }}>
                Everything you need to maintain a consistent journaling habit, tailored to your personal categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div 
                className="p-8 rounded-3xl border space-y-4 transition-all hover:-translate-y-1 shadow-sm"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)' }}
                >
                  <TagIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-theme-heading">
                  Custom Categories
                </h3>
                <p className="text-sm leading-relaxed opacity-80" style={{ color: 'var(--text-muted)' }}>
                  Track default system pillars like Work, Health, and Family, or add custom tags like Friends or Hobbies with individual scores.
                </p>
              </div>

              {/* Feature 2 */}
              <div 
                className="p-8 rounded-3xl border space-y-4 transition-all hover:-translate-y-1 shadow-sm"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)' }}
                >
                  <LightBulbIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-theme-heading">
                  Rich HTML Prompts
                </h3>
                <p className="text-sm leading-relaxed opacity-80" style={{ color: 'var(--text-muted)' }}>
                  Express yourself freely using JSONB block storage and HTML support across highlights, gratitude, and daily thoughts.
                </p>
              </div>

              {/* Feature 3 */}
              <div 
                className="p-8 rounded-3xl border space-y-4 transition-all hover:-translate-y-1 shadow-sm"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)' }}
                >
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-theme-heading">
                  Rating Analytics
                </h3>
                <p className="text-sm leading-relaxed opacity-80" style={{ color: 'var(--text-muted)' }}>
                  Visualize your category scores over time to discover trends, balance your routine, and make every day better.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}