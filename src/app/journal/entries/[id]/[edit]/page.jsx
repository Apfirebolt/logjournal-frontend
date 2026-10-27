'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import HabitChecklist from '@/components/HabitCheckList';
import { useJournalStore } from '@/store/useJournalStore';
import { PencilSquareIcon, CheckIcon, StarIcon, ArrowLeftIcon, TagIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function EditEntryPage() {
  const params = useParams();
  const router = useRouter();
  const entryId = params?.id;

  const { currentEntry, fetchEntryById, updateEntry, categories, fetchCategories, loading } = useJournalStore();

  const [title, setTitle] = useState('');
  const [journalDate, setJournalDate] = useState('');
  const [categoryRatings, setCategoryRatings] = useState({});
  const [habits, setHabits] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const highlightsEditorRef = useRef(null);
  const gratitudeEditorRef = useRef(null);
  const thoughtsEditorRef = useRef(null);
  const categoryEditorsRefs = useRef({}); // { [categoryId]: DOM element ref }

  const editorInstanceRef = useRef({
    highlights: null,
    gratitude: null,
    thoughts: null,
    categories: {}, // { [categoryId]: EditorJS instance }
  });

  useEffect(() => {
    fetchCategories();
    if (entryId) {
      fetchEntryById(entryId);
    }
  }, [entryId, fetchCategories, fetchEntryById]);

  // Pre-fill form when currentEntry is loaded
  useEffect(() => {
    if (currentEntry) {
      setTitle(currentEntry.title || '');
      if (currentEntry.journal_date) {
        setJournalDate(new Date(currentEntry.journal_date).toISOString().split('T')[0]);
      }

      // Map existing category ratings and pre-load content blocks if available
      const initialRatings = {};
      const initialCategoryBlocks = {};
      
      currentEntry.category_sections?.forEach((sec) => {
        initialRatings[sec.category_id] = sec.rating_score;
        if (sec.content) {
          initialCategoryBlocks[sec.category_id] = typeof sec.content === 'string' ? JSON.parse(sec.content) : sec.content;
        }
      });
      setCategoryRatings(initialRatings);

      // Map existing habits
      if (currentEntry.habits) {
        setHabits(currentEntry.habits);
      }

      // Initialize Editor.js with existing blocks if available
      async function initEditors() {
        if (typeof window === 'undefined') return;

        const EditorJS = (await import('@editorjs/editorjs')).default;
        const HeaderBlock = (await import('@editorjs/header')).default;
        const ParagraphBlock = (await import('@editorjs/paragraph')).default;
        const ListBlock = (await import('@editorjs/list')).default;
        const DelimiterBlock = (await import('@editorjs/delimiter')).default;
        const QuoteBlock = (await import('@editorjs/quote')).default;
        const MarkerBlock = (await import('@editorjs/marker')).default;

        const parseBlocks = (dataStr) => {
          if (!dataStr) return [];
          try {
            return typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
          } catch (e) {
            return [{ type: 'paragraph', data: { text: String(dataStr) } }];
          }
        };

        if (highlightsEditorRef.current && !editorInstanceRef.current.highlights) {
          editorInstanceRef.current.highlights = new EditorJS({
            holder: highlightsEditorRef.current,
            data: { blocks: parseBlocks(currentEntry.highlights) },
            tools: { header: HeaderBlock, paragraph: ParagraphBlock, list: ListBlock, delimiter: DelimiterBlock, quote: QuoteBlock, marker: MarkerBlock },
          });
        }

        if (gratitudeEditorRef.current && !editorInstanceRef.current.gratitude) {
          editorInstanceRef.current.gratitude = new EditorJS({
            holder: gratitudeEditorRef.current,
            data: { blocks: parseBlocks(currentEntry.gratitude) },
            tools: { header: HeaderBlock, paragraph: ParagraphBlock, list: ListBlock, marker: MarkerBlock },
          });
        }

        if (thoughtsEditorRef.current && !editorInstanceRef.current.thoughts) {
          editorInstanceRef.current.thoughts = new EditorJS({
            holder: thoughtsEditorRef.current,
            data: { blocks: parseBlocks(currentEntry.better_day_thoughts) },
            tools: { header: HeaderBlock, paragraph: ParagraphBlock, list: ListBlock },
          });
        }

        // Initialize Dynamic Category Editors with pre-existing content blocks
        categories.forEach((cat) => {
          const holderElement = categoryEditorsRefs.current[cat.id];
          if (holderElement && !editorInstanceRef.current.categories[cat.id]) {
            editorInstanceRef.current.categories[cat.id] = new EditorJS({
              holder: holderElement,
              data: { blocks: initialCategoryBlocks[cat.id] || [] },
              placeholder: `Record notes, activities, or reflections for ${cat.name}...`,
              tools: { header: HeaderBlock, paragraph: ParagraphBlock, list: ListBlock, marker: MarkerBlock },
            });
          }
        });
      }

      initEditors();
    }
  }, [currentEntry, categories]);

  const handleRatingChange = (categoryId, score) => {
    setCategoryRatings((prev) => ({ ...prev, [categoryId]: score }));
  };

  async function handleUpdate(e) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please provide a title.');
      return;
    }

    setIsSubmitting(true);

    try {
      const highlightsData = editorInstanceRef.current.highlights ? await editorInstanceRef.current.highlights.save() : null;
      const gratitudeData = editorInstanceRef.current.gratitude ? await editorInstanceRef.current.gratitude.save() : null;
      const thoughtsData = editorInstanceRef.current.thoughts ? await editorInstanceRef.current.thoughts.save() : null;

      // Gather category sections with both their rich text content blocks and rating scores
      const category_sections = [];
      for (const cat of categories) {
        const editorInstance = editorInstanceRef.current.categories[cat.id];
        let categoryBlocks = [];
        if (editorInstance) {
          const savedData = await editorInstance.save();
          categoryBlocks = savedData.blocks || [];
        }

        const rating = categoryRatings[cat.id] || null;

        if (categoryBlocks.length > 0 || rating !== null) {
          category_sections.push({
            category_id: cat.id,
            rating_score: rating ? parseFloat(rating) : null,
            content: categoryBlocks,
          });
        }
      }

      const payload = {
        title: title.trim(),
        journal_date: journalDate ? new Date(journalDate).toISOString() : null,
        highlights: highlightsData ? JSON.stringify(highlightsData.blocks) : '',
        gratitude: gratitudeData ? JSON.stringify(gratitudeData.blocks) : '',
        better_day_thoughts: thoughtsData ? JSON.stringify(thoughtsData.blocks) : '',
        category_sections,
        habits,
      };

      const result = await updateEntry(entryId, payload);

      if (result.success) {
        toast.success('Journal entry updated successfully!');
        router.push(`/journal/entries/${entryId}`);
      } else {
        toast.error(result.error || 'Failed to update entry.');
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error('An error occurred while updating.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading && !currentEntry) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col font-theme-body" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <p className="text-sm opacity-60">Loading entry for editing...</p>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col font-theme-body transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
        <Header />

        <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full space-y-10">
          <div className="flex items-center justify-between border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()} 
                className="p-2.5 rounded-xl border transition-all hover:scale-105 cursor-pointer" 
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
              <div>
                <h1 className="text-3xl font-bold font-theme-heading">Edit Journal Entry</h1>
                <p className="text-sm opacity-80 mt-1">Refine your reflections, highlights, or category scores.</p>
              </div>
            </div>

            <button
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              <CheckIcon className="h-5 w-5" />
              <span>{isSubmitting ? 'Updating...' : 'Save Changes'}</span>
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-8">
            
            {/* Journal Date Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80 flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                <span>Journal Date</span>
              </label>
              <input
                type="date"
                value={journalDate}
                onChange={(e) => setJournalDate(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border text-sm focus:outline-none shadow-inner font-theme-heading font-semibold"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">Entry Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border text-base focus:outline-none shadow-inner font-theme-heading font-semibold"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">Highlights</label>
              <div ref={highlightsEditorRef} className="p-6 rounded-2xl border shadow-inner min-h-[160px]" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">Gratitude</label>
              <div ref={gratitudeEditorRef} className="p-6 rounded-2xl border shadow-inner min-h-[140px]" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">Reflection & Improvements</label>
              <div ref={thoughtsEditorRef} className="p-6 rounded-2xl border shadow-inner min-h-[140px]" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
            </div>

            {/* Habit Checklist Component Integration */}
            <HabitChecklist habits={habits} onChange={setHabits} />

            {/* Dynamic Category Sections & Ratings */}
            <div className="space-y-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <h2 className="text-lg font-bold font-theme-heading">Category & Pillar Sections</h2>
                <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Refine rich notes, logs, or schedules for your custom pillars and update your performance ratings.
                </p>
              </div>

              <div className="space-y-6">
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    className="p-6 rounded-3xl border shadow-sm space-y-4"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="flex items-center gap-2">
                        <TagIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                        <h3 className="text-sm font-bold font-theme-heading uppercase tracking-wider">{cat.name}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-60">Pillar Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => handleRatingChange(cat.id, star)}
                              className="p-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                            >
                              <StarIcon 
                                className={`h-5 w-5 ${
                                  (categoryRatings[cat.id] || 0) >= star 
                                    ? 'text-amber-400 fill-amber-400' 
                                    : 'opacity-30'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div 
                      ref={(el) => { categoryEditorsRefs.current[cat.id] = el; }}
                      className="p-6 rounded-2xl border shadow-inner min-h-[140px]"
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                    />
                  </div>
                ))}
              </div>
            </div>

          </form>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}