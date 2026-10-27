'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import HabitChecklist from '@/components/HabitCheckList';
import { useJournalStore } from '@/store/useJournalStore';
import { PencilSquareIcon, CheckIcon, StarIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import AOS from 'aos';

export default function NewEntryClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, fetchCategories, createEntry, loading } = useJournalStore();

  const [title, setTitle] = useState('');
  
  const [journalDate, setJournalDate] = useState(() => {
    const paramDate = searchParams.get('date');
    if (paramDate) {
      return paramDate;
    }
    return new Date().toISOString().split('T')[0];
  });

  const [categoryRatings, setCategoryRatings] = useState({});
  const [habits, setHabits] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
    fetchCategories();
  }, [fetchCategories]);

  // Initialize Editors with Medium-like Tools (No Images, Multi-level Headers, Tables, Code)
  useEffect(() => {
    let isMounted = true;

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
      const TableBlock = (await import('@editorjs/table')).default; // <--- Table Tool

      if (!isMounted) return;

      const editorTools = {
        header: {
          class: HeaderBlock,
          config: {
            levels: [2, 3, 4], // Medium style H2, H3, H4
            defaultLevel: 2,
          }
        },
        paragraph: {
          class: ParagraphBlock,
          inlineToolbar: true,
        },
        list: {
          class: ListBlock,
          inlineToolbar: true,
        },
        quote: {
          class: QuoteBlock,
          inlineToolbar: true,
        },
        delimiter: DelimiterBlock,
        marker: MarkerBlock,
        code: CodeBlock,
        table: TableBlock,
      };

      // 1. Highlights Editor
      if (highlightsEditorRef.current && !editorInstanceRef.current.highlights) {
        editorInstanceRef.current.highlights = new EditorJS({
          holder: highlightsEditorRef.current,
          placeholder: 'Tell your story... What were your main highlights today?',
          tools: editorTools,
        });
      }

      // 2. Gratitude Editor
      if (gratitudeEditorRef.current && !editorInstanceRef.current.gratitude) {
        editorInstanceRef.current.gratitude = new EditorJS({
          holder: gratitudeEditorRef.current,
          placeholder: 'What are you grateful for today?',
          tools: editorTools,
        });
      }

      // 3. Better Day Thoughts Editor
      if (thoughtsEditorRef.current && !editorInstanceRef.current.thoughts) {
        editorInstanceRef.current.thoughts = new EditorJS({
          holder: thoughtsEditorRef.current,
          placeholder: 'Reflections... How could today have been even better?',
          tools: editorTools,
        });
      }

      // 4. Dynamic Category Editors
      categories.forEach((cat) => {
        const holderElement = categoryEditorsRefs.current[cat.id];
        if (holderElement && !editorInstanceRef.current.categories[cat.id]) {
          editorInstanceRef.current.categories[cat.id] = new EditorJS({
            holder: holderElement,
            placeholder: `Record notes, activities, or reflections for ${cat.name}...`,
            tools: editorTools,
          });
        }
      });
    }

    initEditors();

    return () => {
      isMounted = false;
      if (editorInstanceRef.current.highlights?.destroy) {
        editorInstanceRef.current.highlights.destroy();
        editorInstanceRef.current.highlights = null;
      }
      if (editorInstanceRef.current.gratitude?.destroy) {
        editorInstanceRef.current.gratitude.destroy();
        editorInstanceRef.current.gratitude = null;
      }
      if (editorInstanceRef.current.thoughts?.destroy) {
        editorInstanceRef.current.thoughts.destroy();
        editorInstanceRef.current.thoughts = null;
      }
      Object.keys(editorInstanceRef.current.categories).forEach((catId) => {
        if (editorInstanceRef.current.categories[catId]?.destroy) {
          editorInstanceRef.current.categories[catId].destroy();
          delete editorInstanceRef.current.categories[catId];
        }
      });
    };
  }, [categories]);

  const handleRatingChange = (categoryId, score) => {
    setCategoryRatings((prev) => ({ ...prev, [categoryId]: score }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please provide a title for your journal entry.');
      return;
    }

    setIsSubmitting(true);

    try {
      const highlightsData = editorInstanceRef.current.highlights
        ? await editorInstanceRef.current.highlights.save()
        : null;
      const gratitudeData = editorInstanceRef.current.gratitude
        ? await editorInstanceRef.current.gratitude.save()
        : null;
      const thoughtsData = editorInstanceRef.current.thoughts
        ? await editorInstanceRef.current.thoughts.save()
        : null;

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

      const result = await createEntry(payload);

      if (result.success) {
        toast.success('Journal entry saved successfully!');
        router.push('/journal/entries');
      } else {
        toast.error(result.error || 'Failed to save entry.');
      }
    } catch (err) {
      console.error('Editor save error:', err);
      toast.error('An error occurred while saving your entry.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthGuard>
      <div 
        className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
      >
        <Header />

        <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full space-y-10">
          
          <div 
            className="flex items-center justify-between border-b pb-6" 
            style={{ borderColor: 'var(--border-color)' }}
            data-aos="fade-down"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
                <PencilSquareIcon className="h-3.5 w-3.5" />
                <span>Medium-Style Story Editor</span>
              </div>
              <h1 className="text-3xl font-bold font-theme-heading tracking-tight">New Journal Entry</h1>
              <p className="text-sm opacity-80 mt-1" style={{ color: 'var(--text-muted)' }}>
                Draft rich stories, notes, and tables for {journalDate}.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              <CheckIcon className="h-5 w-5" />
              <span>{isSubmitting ? 'Saving...' : 'Save Entry'}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-2" data-aos="fade-up" data-aos-delay="100">
              <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80 flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                <span>Journal Date</span>
              </label>
              <input
                type="date"
                value={journalDate}
                onChange={(e) => setJournalDate(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border text-sm focus:outline-none shadow-inner font-theme-heading font-semibold"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)'
                }}
                required
              />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-delay="150">
              <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">
                Story Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Reflections on System Architecture & Life"
                className="w-full px-4 py-3.5 rounded-2xl border text-base focus:outline-none shadow-inner font-theme-heading font-semibold"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)'
                }}
                required
              />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-delay="200">
              <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">
                Today's Highlights
              </label>
              <div 
                ref={highlightsEditorRef}
                className="p-6 rounded-2xl border shadow-inner min-h-[160px]"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                }}
              />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-delay="250">
              <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">
                Gratitude
              </label>
              <div 
                ref={gratitudeEditorRef}
                className="p-6 rounded-2xl border shadow-inner min-h-[140px]"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                }}
              />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-delay="300">
              <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">
                Better Day Thoughts (Reflection)
              </label>
              <div 
                ref={thoughtsEditorRef}
                className="p-6 rounded-2xl border shadow-inner min-h-[140px]"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                }}
              />
            </div>

            <div data-aos="fade-up" data-aos-delay="350">
              <HabitChecklist habits={habits} onChange={setHabits} />
            </div>

            <div className="space-y-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }} data-aos="fade-up" data-aos-delay="400">
              <div>
                <h2 className="text-lg font-bold font-theme-heading">Category & Pillar Sections</h2>
                <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Add rich notes, tables, or reflections for your custom pillars and rate your performance.
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