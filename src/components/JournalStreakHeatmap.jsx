'use client';

import React, { useMemo } from 'react';
import { FireIcon, TrophyIcon } from '@lucide/react';

export default function JournalStreakHeatmap({ entries = [] }) {
 
  const entryDateMap = useMemo(() => {
    const map = {};
    entries.forEach((entry) => {
      const timestamp = entry.created_at || entry.createdAt;
      if (!timestamp) return;
      const dateStr = new Date(timestamp).toISOString().split('T')[0];
      map[dateStr] = (map[dateStr] || 0) + 1;
    });
    return map;
  }, [entries]);

  const { currentStreak, maxStreak, totalEntries } = useMemo(() => {
    let curr = 0;
    let max = 0;
    let tempStreak = 0;
    let total = entries.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check last 365 days
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      if (entryDateMap[dateStr]) {
        tempStreak++;
        if (i === 0 || i === 1) {
          curr = tempStreak;
        }
      } else {
        if (i > 1) {
          // If missed more than yesterday/today, current streak stops
          if (curr === 0) curr = tempStreak;
        }
        tempStreak = 0;
      }
      if (tempStreak > max) max = tempStreak;
    }

    return { currentStreak: Math.max(curr, entryDateMap[today.toISOString().split('T')[0]] ? 1 : 0), maxStreak: Math.max(max, curr), totalEntries: total };
  }, [entryDateMap, entries]);

  const weeks = useMemo(() => {
    const wList = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 182);
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() + 1);
    }

    let currentWeek = [];
    let iterDate = new Date(startDate);

    while (iterDate <= today) {
      const dateStr = iterDate.toISOString().split('T')[0];
      const count = entryDateMap[dateStr] || 0;

      currentWeek.push({
        date: dateStr,
        count,
        formattedDate: iterDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });

      if (currentWeek.length === 7) {
        wList.push(currentWeek);
        currentWeek = [];
      }

      iterDate.setDate(iterDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      wList.push(currentWeek);
    }

    return wList;
  }, [entryDateMap]);

  return (
    <div 
      className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 transition-colors duration-300"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
    >
      {/* Header & Stats Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <h3 className="text-xl font-bold font-theme-heading tracking-tight">Journaling Activity & Streaks</h3>
          <p className="text-xs opacity-75 mt-1" style={{ color: 'var(--text-muted)' }}>
            Your consistency over the past 6 months. Every reflection counts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Current Streak Badge */}
          <div className="px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 shadow-xs" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
            <FireIcon className="h-5 w-5 text-amber-500 fill-amber-500 animate-pulse" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-60" style={{ color: 'var(--text-muted)' }}>Current Streak</p>
              <p className="text-sm font-extrabold font-mono" style={{ color: 'var(--text-main)' }}>{currentStreak} Days</p>
            </div>
          </div>

          {/* Total Entries Badge */}
          <div className="px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 shadow-xs" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
            <TrophyIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-60" style={{ color: 'var(--text-muted)' }}>Total Entries</p>
              <p className="text-sm font-extrabold font-mono" style={{ color: 'var(--text-main)' }}>{totalEntries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1.5 min-w-full justify-center">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day) => {
                let bgStyle = 'var(--bg-primary)';
                if (day.count > 0) {
                  bgStyle = 'var(--accent)';
                }

                return (
                  <div
                    key={day.date}
                    title={`${day.count} entry on ${day.formattedDate}`}
                    className="w-3.5 h-3.5 rounded-md border transition-all hover:scale-125 cursor-pointer"
                    style={{
                      backgroundColor: day.count > 0 ? bgStyle : 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      opacity: day.count > 0 ? 0.9 : 0.4,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 text-xs opacity-75 pt-2" style={{ color: 'var(--text-muted)' }}>
        <span>Less</span>
        <div className="w-3 h-3 rounded border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', opacity: 0.4 }} />
        <div className="w-3 h-3 rounded border" style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--border-color)' }} />
        <span>More</span>
      </div>
    </div>
  );
}