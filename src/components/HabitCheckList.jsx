'use client';

import React, { useState } from 'react';
import { PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function HabitChecklist({ habits = [], onChange }) {
  const [newHabitName, setNewHabitName] = useState('');

  // Safeguard habits array
  const safeHabits = Array.isArray(habits) ? habits : [];

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const updated = [...safeHabits, { task_name: newHabitName.trim(), is_completed: false }];
    onChange(updated);
    setNewHabitName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHabit(e);
    }
  };

  const toggleHabit = (index) => {
    const updated = safeHabits.map((h, i) => (i === index ? { ...h, is_completed: !h.is_completed } : h));
    onChange(updated);
  };

  const removeHabit = (index) => {
    const updated = safeHabits.filter((_, i) => i !== index);
    onChange(updated);
  };

  const completedCount = safeHabits.filter((h) => h.is_completed).length;

  return (
    <div 
      className="p-6 rounded-3xl border shadow-sm space-y-4"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
    >
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          <h3 className="text-lg font-bold font-theme-heading uppercase tracking-wider">Daily Habits & Tasks</h3>
        </div>
        <span className="opacity-60">
          {completedCount} / {safeHabits.length} Completed
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a habit (e.g., Drank 3L water, Meditated)..."
          className="w-full px-4 py-2.5 rounded-xl border focus:outline-none shadow-inner"
          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        />
        <button
          type="button"
          onClick={handleAddHabit}
          className="px-4 py-2.5 rounded-xl font-semibold flex items-center gap-1 transition-all shadow-md shrink-0 hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Habits List */}
      <div className="space-y-2">
        {safeHabits.length === 0 ? (
          <p className="opacity-50 italic py-2">No habits added for today yet.</p>
        ) : (
          safeHabits.map((habit, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-xl border flex items-center justify-between gap-3 transition-all"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
            >
              <label className="flex items-center gap-3 cursor-pointer flex-grow select-none">
                <input
                  type="checkbox"
                  checked={Boolean(habit.is_completed)}
                  onChange={() => toggleHabit(idx)}
                  className="w-4 h-4 rounded border accent-[var(--accent)] cursor-pointer"
                />
                <span className={`font-medium ${habit.is_completed ? 'line-through opacity-50' : ''}`}>
                  {habit.task_name}
                </span>
              </label>

              <button
                type="button"
                onClick={() => removeHabit(idx)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}