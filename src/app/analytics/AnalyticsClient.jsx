'use client';

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import JournalStreakHeatmap from '@/components/JournalStreakHeatmap';
import JournalAnalyticsCharts from '@/components/JournalAnalyticsChart';
import { useJournalStore } from '@/store/useJournalStore';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export default function AnalyticsClient() {
  const { entries, fetchEntries, categories, fetchCategories, loading } = useJournalStore();

  useEffect(() => {
    fetchEntries();
    fetchCategories();
  }, [fetchEntries, fetchCategories]);

  return (
    <AuthGuard>
      <div 
        className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
      >
        <Header />

        <main className="flex-grow max-w-6xl mx-auto px-6 py-12 w-full space-y-10">
          
          {/* Page Header */}
          <div className="border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
              <ChartBarIcon className="h-3.5 w-3.5" />
              <span>Journal Metrics</span>
            </div>
            <h1 className="text-3xl font-bold font-theme-heading tracking-tight">Journal Analytics</h1>
            <p className="text-sm opacity-80 mt-1" style={{ color: 'var(--text-muted)' }}>
              Track your journaling streaks, consistency habits, and work life balance.
            </p>
          </div>

          {loading && entries.length === 0 ? (
            <p className="text-sm opacity-60 text-center py-16">Loading analytics data...</p>
          ) : (
            <div className="space-y-10">
              {/* Streak & Contribution Heatmap */}
              <JournalStreakHeatmap entries={entries} />

              {/* Charts & Statistics */}
              <JournalAnalyticsCharts entries={entries} categories={categories} />
            </div>
          )}

        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}