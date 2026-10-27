'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';
import { ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';

// Register Chart.js modules
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function JournalAnalyticsCharts({ entries = [], categories = [] }) {
  // 1. Calculate average score per category across all entries for the Radar Chart
  const radarChartData = useMemo(() => {
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

    const labels = [];
    const dataPoints = [];

    Object.values(categoryStats).forEach((stat) => {
      labels.push(stat.name);
      const avg = stat.count > 0 ? parseFloat((stat.totalScore / stat.count).toFixed(1)) : 0;
      dataPoints.push(avg);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Average Rating',
          data: dataPoints,
          backgroundColor: 'rgba(99, 102, 241, 0.2)', // Accent color tint
          borderColor: 'var(--accent)',
          borderWidth: 2,
          pointBackgroundColor: 'var(--accent)',
        },
      ],
    };
  }, [entries, categories]);

  // 2. Calculate rating frequency distribution (1 to 5 stars) for the Bar Chart
  const barChartData = useMemo(() => {
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

    return {
      labels: Object.keys(dist),
      datasets: [
        {
          label: 'Frequency',
          data: Object.values(dist),
          backgroundColor: 'var(--accent)',
          borderRadius: 8,
        },
      ],
    };
  }, [entries]);

  // Common options to respect your CSS theme variables
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(150, 150, 150, 0.2)' },
        grid: { color: 'rgba(150, 150, 150, 0.2)' },
        ticks: { display: false, max: 5, min: 0 },
        pointLabels: {
          font: { size: 12, family: 'inherit' },
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } },
      },
      y: {
        grid: { color: 'rgba(150, 150, 150, 0.1)' },
        ticks: { precision: 0 },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const hasRadarData = radarChartData.labels.length > 0;
  const hasBarData = barChartData.datasets[0].data.some((val) => val > 0);

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

        <div className="h-72 w-full flex items-center justify-center">
          {hasRadarData ? (
            <Radar data={radarChartData} options={radarOptions} />
          ) : (
            <p className="text-xs opacity-60">No category ratings recorded yet.</p>
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

        <div className="h-72 w-full flex items-center justify-center">
          {hasBarData ? (
            <Bar data={barChartData} options={barOptions} />
          ) : (
            <p className="text-xs opacity-60">No rating distribution data available.</p>
          )}
        </div>
      </div>

    </div>
  );
}