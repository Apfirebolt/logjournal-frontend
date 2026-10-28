'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import HabitChecklist from '@/components/HabitCheckList';
import { useJournalStore } from '@/store/useJournalStore';
import { PencilSquareIcon, CheckIcon, StarIcon, ArrowLeftIcon, TagIcon, CalendarIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function EditEntryPage() {
  const params = useParams();
  const router = useRouter();
  const entryId = params?.id;

  const { currentEntry, fetchEntryById, updateEntry, categories, fetchCategories, loading } = useJournalStore();

  const [title, setTitle] = useState('');
  const [journalDate, setJournalDate] = useState('');
  const [categoryRatings, setCategoryRatings] = useState({});
  const [habits, setHabits] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Section visibility toggle state
  const [visibleSections, setVisibleSections] = useState({
    highlights: true,
    gratitude: true,
    thoughts: true,
    habits: true,
    categories: true,
  });

  // Individual category visibility toggles: { [categoryId]: boolean }
  const [activeCategories, setActiveCategories] = useState({});

  const highlightsEditorRef = useRef(null);
  const gratitudeEditorRef = useRef(null);
  const thoughtsEditorRef = useRef(null);
  const categoryEditorsRefs = useRef({});

  const editorInstanceRef = useRef({
    highlights: null,
    gratitude: null,
    thoughts: null,
    categories: {},
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

      const initialRatings = {};
      const initialCategoryBlocks = {};
      const initialActiveCats = {};
      
      currentEntry.category_sections?.forEach((sec) => {
        initialRatings[sec.category_id] = sec.rating_score;
        initialActiveCats[sec.category_id] = true;
        if (sec.content) {
          initialCategoryBlocks[sec.category_id] = typeof sec.content === 'string' ? JSON.parse(sec.content) : sec.content;
        }
      });
      setCategoryRatings(initialRatings);
      setActiveCategories(initialActiveCats);

      // Set visibility flags based on what data exists in the fetched entry
      setVisibleSections({
        highlights: Boolean(currentEntry.highlights),
        gratitude: Boolean(currentEntry.gratitude),
        thoughts: Boolean(currentEntry.better_day_thoughts),
        habits: Boolean(currentEntry.habits && currentEntry.habits.length > 0),
        categories: Boolean(currentEntry.category_sections && currentEntry.category_sections.length > 0),
      });

      if (currentEntry.habits) {
        setHabits(currentEntry.habits);
      }

      async function initEditors() {
        if (typeof window === 'undefined') return;

        const EditorJS = (await import('@editorjs/editorjs')).default;
        const HeaderBlock = (await import('@editorjs/header')).default;
        const ParagraphBlock = (await import('@editorjs/paragraph')).default;
        const ListBlock = (await import('@editorjs/list')).default;
        const DelimiterBlock = (await import('@editorjs/delimiter')).default;
        const QuoteBlock = (await import('@editorjs/quote')).default;
        const MarkerBlock = (await import('@editorjs/marker')).default;
        const CodeBlock = (await import('@editorjs/code')).default;
        const TableBlock = (await import('@editorjs/table')).default;

        const editorTools = {
          header: {
            class: HeaderBlock,
            config: { levels: [2, 3, 4], defaultLevel: 2 }
          },
          paragraph: { class: ParagraphBlock, inlineToolbar: true },
          list: { class: ListBlock, inlineToolbar: true },
          quote: { class: QuoteBlock, inlineToolbar: true },
          delimiter: DelimiterBlock,
          marker: MarkerBlock,
          code: CodeBlock,
          table: TableBlock,
        };

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
            tools: editorTools,
          });
        }

        if (gratitudeEditorRef.current && !editorInstanceRef.current.gratitude) {
          editorInstanceRef.current.gratitude = new EditorJS({
            holder: gratitudeEditorRef.current,
            data: { blocks: parseBlocks(currentEntry.gratitude) },
            tools: editorTools,
          });
        }

        if (thoughtsEditorRef.current && !editorInstanceRef.current.thoughts) {
          editorInstanceRef.current.thoughts = new EditorJS({
            holder: thoughtsEditorRef.current,
            data: { blocks: parseBlocks(currentEntry.better_day_thoughts) },
            tools: editorTools,
          });
        }

        categories.forEach((cat) => {
          const holderElement = categoryEditorsRefs.current[cat.id];
          if (holderElement && !editorInstanceRef.current.categories[cat.id]) {
            editorInstanceRef.current.categories[cat.id] = new EditorJS({
              holder: holderElement,
              data: { blocks: initialCategoryBlocks[cat.id] || [] },
              placeholder: `Record notes, tables, or reflections for ${cat.name}...`,
              tools: editorTools,
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

  const toggleSection = (key) => {
    setVisibleSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCategory = (catId) => {
    setActiveCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  async function handleUpdate(e) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please provide a title.');
      return;
    }

    setIsSubmitting(true);

    try {
      const highlightsData = (visibleSections.highlights && editorInstanceRef.current.highlights) 
        ? await editorInstanceRef.current.highlights.save() 
        : null;
      const gratitudeData = (visibleSections.gratitude && editorInstanceRef.current.gratitude) 
        ? await editorInstanceRef.current.gratitude.save() 
        : null;
      const thoughtsData = (visibleSections.thoughts && editorInstanceRef.current.thoughts) 
        ? await editorInstanceRef.current.thoughts.save() 
        : null;

      const category_sections = [];
      if (visibleSections.categories) {
        for (const cat of categories) {
          if (!activeCategories[cat.id]) continue;

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
      }

      const payload = {
        title: title.trim(),
        journal_date: journalDate ? new Date(journalDate).toISOString() : null,
        highlights: highlightsData ? JSON.stringify(highlightsData.blocks) : '',
        gratitude: gratitudeData ? JSON.stringify(gratitudeData.blocks) : '',
        better_day_thoughts: thoughtsData ? JSON.stringify(thoughtsData.blocks) : '',
        category_sections,
        habits: visibleSections.habits ? habits : [],
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
            
            {/* Section Visibility Control Panel */}
            <div 
              className="p-5 rounded-2xl border shadow-sm space-y-3"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80" style={{ color: 'var(--accent)' }}>
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                <span>Customize Entry Sections</span>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                  <input type="checkbox" checked={visibleSections.highlights} onChange={() => toggleSection('highlights')} className="rounded accent-[var(--accent)]" />
                  <span>Highlights</span>
                </label>

                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                  <input type="checkbox" checked={visibleSections.gratitude} onChange={() => toggleSection('gratitude')} className="rounded accent-[var(--accent)]" />
                  <span>Gratitude</span>
                </label>

                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                  <input type="checkbox" checked={visibleSections.thoughts} onChange={() => toggleSection('thoughts')} className="rounded accent-[var(--accent)]" />
                  <span>Reflection</span>
                </label>

                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                  <input type="checkbox" checked={visibleSections.habits} onChange={() => toggleSection('habits')} className="rounded accent-[var(--accent)]" />
                  <span>Habit Checklist</span>
                </label>

                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                  <input type="checkbox" checked={visibleSections.categories} onChange={() => toggleSection('categories')} className="rounded accent-[var(--accent)]" />
                  <span>Pillars / Categories</span>
                </label>
              </div>
            </div>

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

            {visibleSections.highlights && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">Highlights</label>
                <div ref={highlightsEditorRef} className="p-6 rounded-2xl border shadow-inner min-h-[160px]" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
              </div>
            )}

            {visibleSections.gratitude && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">Gratitude</label>
                <div ref={gratitudeEditorRef} className="p-6 rounded-2xl border shadow-inner min-h-[140px]" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
              </div>
            )}

            {visibleSections.thoughts && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">Reflection & Improvements</label>
                <div ref={thoughtsEditorRef} className="p-6 rounded-2xl border shadow-inner min-h-[140px]" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
              </div>
            )}

            {visibleSections.habits && (
              <HabitChecklist habits={habits} onChange={setHabits} />
            )}

            {visibleSections.categories && (
              <div className="space-y-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold font-theme-heading">Category & Pillar Sections</h2>
                    <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Refine rich notes, tables, or reflections for your custom pillars and update ratings.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          activeCategories[cat.id] ? 'shadow-sm' : 'opacity-40'
                        }`}
                        style={{
                          backgroundColor: activeCategories[cat.id] ? 'var(--card-bg)' : 'var(--bg-primary)',
                          borderColor: 'var(--border-color)',
                          color: activeCategories[cat.id] ? 'var(--accent)' : 'var(--text-main)',
                        }}
                      >
                        {cat.name} {activeCategories[cat.id] ? '✓' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {categories.map((cat) => {
                    if (!activeCategories[cat.id]) return null;
                    return (
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
                    );
                  })}
                </div>
              </div>
            )}

          </form>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}