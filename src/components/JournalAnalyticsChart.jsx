'use client';

import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function JournalAnalyticsCharts({ entries = [], categories = [] }) {
  // 1. Calculate average score per category across all entries
  const radarData = useMemo(() => {
    const categoryStats = {};

    categories.forEach((cat) => {
      categoryStats[cat.id] = { name: cat.name, totalScore: 0, count: 0 };
    });

    entries.forEach((entry) => {
      entry.category_sections?.forEach((sec) => {
        const catId = sec.category_id;
        const score = Number(sec.rating_score || 0);
        if (categoryStats[catId]) {
          categoryStats[catId].totalScore += score;
          categoryStats[catId].count += 1;
        } else if (sec.category_name) {
          if (!categoryStats[catId]) {
            categoryStats[catId] = { name: sec.category_name, totalScore: 0, count: 0 };
          }
          categoryStats[catId].totalScore += score;
          categoryStats[catId].count += 1;
        }
      });
    });

    return Object.values(categoryStats).map((stat) => ({
      category: stat.name,
      rating: stat.count > 0 ? parseFloat((stat.totalScore / stat.count).toFixed(1)) : 0,
      fullMark: 5,
    }));
  }, [entries, categories]);

  // 2. Calculate rating frequency distribution (1 to 5 stars)
  const distributionData = useMemo(() => {
    const dist = { '1 Star': 0, '2 Stars': 0, '3 Stars': 0, '4 Stars': 0, '5 Stars': 0 };

    entries.forEach((entry) => {
      entry.category_sections?.forEach((sec) => {
        const score = Math.round(sec.rating_score || 0);
        if (score >= 1 && score <= 5) {
          const key = `${score} Star${score > 1 ? 's' : ''}`;
          dist[key] = (dist[key] || 0) + 1;
        }
      });
    });

    return Object.keys(dist).map((key) => ({
      rating: key,
      count: dist[key],
    }));
  }, [entries]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Radar Chart: Life Balance / Pillar Ratings */}
      <div 
        className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
      >
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-theme-heading">Life Balance Radar</h3>
              <p className="text-xs opacity-75" style={{ color: 'var(--text-muted)' }}>Average scores across your journaling pillars (1-5)</p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius={90}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--text-main)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="var(--border-color)" />
                <Radar name="Rating" dataKey="rating" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs opacity-60">
              No category ratings recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart: Rating Frequency Distribution */}
      <div 
        className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
      >
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
              <ChartBarIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-theme-heading">Rating Score Breakdown</h3>
              <p className="text-xs opacity-75" style={{ color: 'var(--text-muted)' }}>Frequency distribution of all star ratings given</p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          {distributionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.4} />
                <XAxis dataKey="rating" stroke="var(--text-main)" fontSize={12} />
                <YAxis stroke="var(--text-main)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card-bg)', 
                    borderColor: 'var(--border-color)', 
                    borderRadius: '12px',
                    color: 'var(--text-main)',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="count" fill="var(--accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs opacity-60">
              No rating distribution data available.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}