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
  LineController,
  BarController
} from 'chart.js';
import { Radar, Bar, Line } from 'react-chartjs-2';
import { ChartBarIcon, SparklesIcon, CheckCircleIcon, CalendarDaysIcon, FireIcon } from '@heroicons/react/24/outline';

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
  Title,
  LineController,
  BarController
);

export default function JournalAnalyticsCharts({ entries = [], categories = [] }) {
  
  // 1. Life Balance Radar Chart Data
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
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: 'var(--accent)',
          borderWidth: 2,
          pointBackgroundColor: 'var(--accent)',
        },
      ],
    };
  }, [entries, categories]);

  // 2. Rating Frequency Distribution Bar Chart Data
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

  // 3. Habit Completion Trend Over Time (Line Chart)
  const habitTrendData = useMemo(() => {
    // Sort entries chronologically by date
    const sortedEntries = [...entries].sort((a, b) => {
      const dateA = new Date(a.journal_date || a.created_at);
      const dateB = new Date(b.journal_date || b.created_at);
      return dateA - dateB;
    });

    const labels = [];
    const completionPercentages = [];

    sortedEntries.slice(-14).forEach((entry) => {
      const dateStr = new Date(entry.journal_date || entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      labels.push(dateStr);

      const habits = entry.habits || [];
      if (habits.length === 0) {
        completionPercentages.push(0);
      } else {
        const completedCount = habits.filter((h) => h.is_completed).length;
        const pct = Math.round((completedCount / habits.length) * 100);
        completionPercentages.push(pct);
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Habit Completion %',
          data: completionPercentages,
          fill: true,
          backgroundColor: 'rgba(0, 180, 216, 0.1)',
          borderColor: 'var(--accent)',
          borderWidth: 2,
          tension: 0.3,
          pointBackgroundColor: 'var(--accent)',
        },
      ],
    };
  }, [entries]);

  // 4. Computed Stats Summary (Total Entries, Average Rating, Habit Success Rate)
  const statsSummary = useMemo(() => {
    const totalEntries = entries.length;
    let totalScoreSum = 0;
    let scoreCount = 0;
    let totalHabitsChecked = 0;
    let totalHabitsPossible = 0;

    entries.forEach((entry) => {
      entry.category_sections?.forEach((sec) => {
        if (sec.rating_score) {
          totalScoreSum += Number(sec.rating_score);
          scoreCount += 1;
        }
      });
      entry.habits?.forEach((h) => {
        totalHabitsPossible += 1;
        if (h.is_completed) totalHabitsChecked += 1;
      });
    });

    const overallAvgRating = scoreCount > 0 ? (totalScoreSum / scoreCount).toFixed(1) : '0.0';
    const habitSuccessRate = totalHabitsPossible > 0 ? Math.round((totalHabitsChecked / totalHabitsPossible) * 100) : 0;

    return { totalEntries, overallAvgRating, habitSuccessRate };
  }, [entries]);

  // Chart Options
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(150, 150, 150, 0.2)' },
        grid: { color: 'rgba(150, 150, 150, 0.2)' },
        ticks: { display: false, max: 5, min: 0 },
        pointLabels: { font: { size: 12, family: 'inherit' } },
      },
    },
    plugins: { legend: { display: false } },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 12 } } },
      y: { grid: { color: 'rgba(150, 150, 150, 0.1)' }, ticks: { precision: 0 } },
    },
    plugins: { legend: { display: false } },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { min: 0, max: 100, grid: { color: 'rgba(150, 150, 150, 0.1)' }, ticks: { callback: (val) => `${val}%` } },
    },
    plugins: { legend: { display: false } },
  };

  const hasRadarData = radarChartData.labels.length > 0;
  const hasBarData = barChartData.datasets[0].data.some((val) => val > 0);
  const hasLineData = habitTrendData.labels.length > 0;

  return (
    <div className="space-y-8">
      
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl border shadow-sm flex items-center gap-4" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="p-3 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
            <CalendarDaysIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Total Logs</p>
            <h4 className="text-2xl font-bold font-theme-heading">{statsSummary.totalEntries}</h4>
          </div>
        </div>

        <div className="p-6 rounded-3xl border shadow-sm flex items-center gap-4" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="p-3 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
            <SparklesIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Average Rating</p>
            <h4 className="text-2xl font-bold font-theme-heading">{statsSummary.overallAvgRating} <span className="text-xs opacity-50">/ 5</span></h4>
          </div>
        </div>

        <div className="p-6 rounded-3xl border shadow-sm flex items-center gap-4" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="p-3 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
            <CheckCircleIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Habit Success Rate</p>
            <h4 className="text-2xl font-bold font-theme-heading">{statsSummary.habitSuccessRate}%</h4>
          </div>
        </div>
      </div>

      {/* Primary Grid: Radar & Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Radar Chart */}
        <div className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
          <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                <SparklesIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-theme-heading">Life Balance Radar</h3>
                <p className="text-xs opacity-75" style={{ color: 'var(--text-muted)' }}>Average scores across journaling categories (1-5)</p>
              </div>
            </div>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            {hasRadarData ? <Radar data={radarChartData} options={radarOptions} /> : <p className="text-xs opacity-60">No category ratings recorded yet.</p>}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
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
            {hasBarData ? <Bar data={barChartData} options={barOptions} /> : <p className="text-xs opacity-60">No rating distribution data available.</p>}
          </div>
        </div>

      </div>

      {/* Full Width Line Chart: Habit Consistency Trend */}
      <div className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
              <FireIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-theme-heading">Habit Completion Trend</h3>
              <p className="text-xs opacity-75" style={{ color: 'var(--text-muted)' }}>Daily habit success percentage over your recent entries</p>
            </div>
          </div>
        </div>
        <div className="h-72 w-full flex items-center justify-center">
          {hasLineData ? <Line data={habitTrendData} options={lineOptions} /> : <p className="text-xs opacity-60">No habit tracking data recorded yet.</p>}
        </div>
      </div>

    </div>
  );
}