'use client';

import React, { useState } from 'react';
import { CheckIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function HabitChecklist({ habits = [], onChange }) {
  const [newHabitName, setNewHabitName] = useState('');

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const updated = [...habits, { task_name: newHabitName.trim(), is_completed: false }];
    onChange(updated);
    setNewHabitName('');
  };

  const toggleHabit = (index) => {
    const updated = habits.map((h, i) => (i === index ? { ...h, is_completed: !h.is_completed } : h));
    onChange(updated);
  };

  const removeHabit = (index) => {
    const updated = habits.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div 
      className="p-6 rounded-3xl border shadow-sm space-y-4"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
    >
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          <h3 className="text-sm font-bold font-theme-heading uppercase tracking-wider">Daily Habits & Tasks</h3>
        </div>
        <span className="text-xs font-mono opacity-60">
          {habits.filter((h) => h.is_completed).length} / {habits.length} Completed
        </span>
      </div>

      {/* Add Habit Input Form */}
      <form onSubmit={handleAddHabit} className="flex gap-2">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="Add a habit (e.g., Drank 3L water, Meditated)..."
          className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none shadow-inner"
          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shadow-md shrink-0 hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add</span>
        </button>
      </form>

      {/* Habits List */}
      <div className="space-y-2">
        {habits.length === 0 ? (
          <p className="text-xs opacity-50 italic py-2">No habits added for today yet.</p>
        ) : (
          habits.map((habit, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-xl border flex items-center justify-between gap-3 transition-all"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
            >
              <label className="flex items-center gap-3 cursor-pointer flex-grow select-none">
                <input
                  type="checkbox"
                  checked={habit.is_completed}
                  onChange={() => toggleHabit(idx)}
                  className="w-4 h-4 rounded border accent-[var(--accent)] cursor-pointer"
                />
                <span className={`text-xs font-medium ${habit.is_completed ? 'line-through opacity-50' : ''}`}>
                  {habit.task_name}
                </span>
              </label>

              <button
                type="button"
                onClick={() => removeHabit(idx)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
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