'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarDaysIcon, 
  XMarkIcon,
  BookOpenIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function JournalCalendar({ entries = [], onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal State for Day Details Inspection
  const [selectedDayData, setSelectedDayData] = useState(null); // { dateStr, entries }
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of the month and total days in the month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Navigation handlers
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Map entries to YYYY-MM-DD keys for fast lookup
  const entryMap = {};

  entries.forEach((entry) => {
    const timestamp = entry.created_at || entry.createdAt;
    if (!timestamp) return;
    const dateStr = new Date(timestamp).toISOString().split('T')[0];
    if (!entryMap[dateStr]) {
      entryMap[dateStr] = [];
    }
    entryMap[dateStr].push(entry);
  });

  // Handle cell click to open day inspection modal
  const handleCellClick = (dateKey, dayEntries) => {
    setSelectedDayData({ dateStr: dateKey, entries: dayEntries });
    setIsDayModalOpen(true);
    if (onSelectDate) {
      onSelectDate(dateKey, dayEntries);
    }
  };

  // Build calendar grid cells
  const calendarCells = [];
  
  // Empty padding cells for previous month offset
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(
      <div 
        key={`empty-${i}`} 
        className="h-32 rounded-2xl border border-dashed opacity-20 hidden sm:block" 
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
      />
    );
  }

  // Active month days
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateKey = `${year}-${formattedMonth}-${formattedDay}`;
    
    const dayEntries = entryMap[dateKey] || [];
    const hasActivity = dayEntries.length > 0;
    const isToday = 
      day === new Date().getDate() && 
      month === new Date().getMonth() && 
      year === new Date().getFullYear();

    calendarCells.push(
      <div
        key={dateKey}
        onClick={() => hasActivity && handleCellClick(dateKey, dayEntries)}
        className={`h-32 p-3 rounded-2xl border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
          isToday 
            ? 'shadow-md ring-2 ring-[var(--accent)]' 
            : hasActivity 
              ? 'hover:-translate-y-0.5 hover:shadow-xl shadow-sm cursor-pointer' 
              : 'opacity-70'
        }`}
        style={{
          backgroundColor: isToday ? 'var(--card-bg)' : hasActivity ? 'var(--card-bg)' : 'var(--bg-primary)',
          borderColor: isToday ? 'var(--accent)' : hasActivity ? 'var(--accent)' : 'var(--border-color)',
          opacity: hasActivity || isToday ? 1 : 0.6
        }}
      >
        {/* Top: Date Number & Status Pill */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold font-mono w-7 h-7 flex items-center justify-center rounded-xl transition-all ${
            isToday 
              ? 'text-white font-extrabold shadow-sm' 
              : hasActivity 
                ? 'font-bold' 
                : 'opacity-50'
          }`}
          style={
            isToday 
              ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }
              : hasActivity
                ? { backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '1px solid var(--border-color)' }
                : { backgroundColor: 'var(--border-color)', color: 'var(--text-muted)' }
          }
          >
            {day}
          </span>
          
          {hasActivity ? (
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}
            >
              {dayEntries.length} {dayEntries.length === 1 ? 'Entry' : 'Entries'}
            </span>
          ) : (
            <span className="text-[9px] uppercase tracking-wider opacity-40 font-mono" style={{ color: 'var(--text-muted)' }}>
              Missed
            </span>
          )}
        </div>

        {/* Middle: Miniature Entry Titles (up to 2 items) */}
        {hasActivity ? (
          <div className="space-y-1 my-auto overflow-hidden">
            {dayEntries.slice(0, 2).map((entry, idx) => (
              <div 
                key={entry.id || idx} 
                className="text-[10px] px-2 py-1 rounded-lg flex items-center justify-between gap-1 truncate font-theme-body border"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              >
                <span className="truncate font-medium flex items-center gap-1">
                  <BookOpenIcon className="h-3 w-3 shrink-0" style={{ color: 'var(--accent)' }} />
                  {entry.title || 'Untitled Entry'}
                </span>
              </div>
            ))}
            {dayEntries.length > 2 && (
              <p className="text-[9px] text-center font-mono opacity-60 font-bold" style={{ color: 'var(--text-muted)' }}>
                +{dayEntries.length - 2} more
              </p>
            )}
          </div>
        ) : (
          <div className="my-auto text-center text-[10px] italic font-theme-body select-none opacity-40" style={{ color: 'var(--text-muted)' }}>
            No journal written
          </div>
        )}

        {/* Bottom Status Indicator */}
        <div className="pt-1.5 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-[9px] uppercase font-bold font-theme-heading tracking-wider opacity-60" style={{ color: 'var(--text-muted)' }}>
            Status
          </span>
          <span className={`text-xs font-bold font-theme-heading ${hasActivity ? '' : 'opacity-40'}`} style={{ color: hasActivity ? 'var(--accent)' : 'var(--text-muted)' }}>
            {hasActivity ? 'Written ✨' : 'Not Written'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="space-y-6 w-full border rounded-3xl p-6 sm:p-8 shadow-sm font-theme-body backdrop-blur-xl transition-colors duration-300"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
    >
      
      {/* Calendar Header / Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-inner"
            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
          >
            <CalendarDaysIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-theme-heading tracking-tight" style={{ color: 'var(--text-main)' }}>
              {MONTH_NAMES[month]} <span style={{ color: 'var(--accent)' }}>{year}</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border transition-all active:scale-95"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              aria-label="Previous Month"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
            >
              Today
            </button>

            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border transition-all active:scale-95"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              aria-label="Next Month"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-2 text-center py-2.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
        {DAY_NAMES.map((day) => (
          <span key={day} className="text-xs font-bold uppercase tracking-widest opacity-60 font-theme-heading" style={{ color: 'var(--text-main)' }}>
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2.5 sm:gap-3.5">
        {calendarCells}
      </div>

      {/* Day Details Inspection Modal */}
      <Transition appear show={isDayModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsDayModalOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel 
                  className="w-full max-w-lg transform overflow-hidden rounded-[2rem] border p-8 text-left align-middle shadow-2xl transition-all space-y-6"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                >
                  
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center border"
                        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
                      >
                        <CalendarDaysIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <DialogTitle as="h3" className="text-base font-extrabold font-theme-heading">
                          Journal Entries for {selectedDayData?.dateStr}
                        </DialogTitle>
                        <p className="text-xs font-mono font-bold opacity-70" style={{ color: 'var(--text-muted)' }}>
                          Total Entries: <span style={{ color: 'var(--accent)' }}>{selectedDayData?.entries.length || 0}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsDayModalOpen(false)}
                      className="p-1.5 rounded-xl border transition-colors cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Entries List */}
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {selectedDayData?.entries.map((entry, idx) => (
                      <Link 
                        key={entry.id || idx}
                        href={`/journal/entries/${entry.id}`}
                        onClick={() => setIsDayModalOpen(false)}
                        className="p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all hover:scale-[1.01] group"
                        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                              Journal Entry
                            </span>
                          </div>
                          <p className="text-sm font-bold font-theme-heading group-hover:opacity-90">
                            {entry.title || 'Untitled Entry'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                            <span>Read</span>
                            <ArrowRightIcon className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="pt-2 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
                    <button
                      onClick={() => setIsDayModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                    >
                      Close
                    </button>
                  </div>

                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
}