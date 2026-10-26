'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useJournalStore } from '@/store/useJournalStore';
import { PencilSquareIcon, SparklesIcon, CheckIcon, StarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function NewEntryPage() {
  const router = useRouter();
  const { categories, fetchCategories, createEntry, loading } = useJournalStore();

  const [title, setTitle] = useState('');
  const [categoryRatings, setCategoryRatings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editor.js Refs for Highlights, Gratitude, and Thoughts
  const highlightsEditorRef = useRef(null);
  const gratitudeEditorRef = useRef(null);
  const thoughtsEditorRef = useRef(null);

  const editorInstanceRef = useRef({
    highlights: null,
    gratitude: null,
    thoughts: null,
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Initialize Editor.js instances on mount
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

      if (!isMounted) return;

      // 1. Highlights Editor
      if (highlightsEditorRef.current && !editorInstanceRef.current.highlights) {
        editorInstanceRef.current.highlights = new EditorJS({
          holder: highlightsEditorRef.current,
          placeholder: 'What were your main highlights today?',
          tools: {
            header: HeaderBlock,
            paragraph: ParagraphBlock,
            list: ListBlock,
            delimiter: DelimiterBlock,
            quote: QuoteBlock,
            marker: MarkerBlock,
          },
        });
      }

      // 2. Gratitude Editor
      if (gratitudeEditorRef.current && !editorInstanceRef.current.gratitude) {
        editorInstanceRef.current.gratitude = new EditorJS({
          holder: gratitudeEditorRef.current,
          placeholder: 'What are you grateful for today?',
          tools: {
            header: HeaderBlock,
            paragraph: ParagraphBlock,
            list: ListBlock,
            marker: MarkerBlock,
          },
        });
      }

      // 3. Better Day Thoughts Editor
      if (thoughtsEditorRef.current && !editorInstanceRef.current.thoughts) {
        editorInstanceRef.current.thoughts = new EditorJS({
          holder: thoughtsEditorRef.current,
          placeholder: 'How could today have been even better?',
          tools: {
            header: HeaderBlock,
            paragraph: ParagraphBlock,
            list: ListBlock,
          },
        });
      }
    }

    initEditors();

    return () => {
      isMounted = false;
      // Cleanup editors on unmount
      ['highlights', 'gratitude', 'thoughts'].forEach((key) => {
        if (editorInstanceRef.current[key]?.destroy) {
          editorInstanceRef.current[key].destroy();
          editorInstanceRef.current[key] = null;
        }
      });
    };
  }, []);

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
      // Extract data from Editor.js instances
      const highlightsData = editorInstanceRef.current.highlights
        ? await editorInstanceRef.current.highlights.save()
        : null;
      const gratitudeData = editorInstanceRef.current.gratitude
        ? await editorInstanceRef.current.gratitude.save()
        : null;
      const thoughtsData = editorInstanceRef.current.thoughts
        ? await editorInstanceRef.current.thoughts.save()
        : null;

      // Format category sections for backend
      const category_sections = Object.entries(categoryRatings).map(([catId, score]) => ({
        category_id: parseInt(catId),
        rating_score: parseFloat(score),
        content: { note: `Rated ${score}/5 stars` },
      }));

      const payload = {
        title: title.trim(),
        highlights: highlightsData ? JSON.stringify(highlightsData.blocks) : '',
        gratitude: gratitudeData ? JSON.stringify(gratitudeData.blocks) : '',
        better_day_thoughts: thoughtsData ? JSON.stringify(thoughtsData.blocks) : '',
        category_sections,
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
    <div 
      className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
    >
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full space-y-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
              <PencilSquareIcon className="h-3.5 w-3.5" />
              <span>Daily Log</span>
            </div>
            <h1 className="text-3xl font-bold font-theme-heading tracking-tight">New Journal Entry</h1>
            <p className="text-sm opacity-80 mt-1" style={{ color: 'var(--text-muted)' }}>
              Capture your daily milestones, gratitude, and category ratings.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105 disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
          >
            <CheckIcon className="h-5 w-5" />
            <span>{isSubmitting ? 'Saving...' : 'Save Entry'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Entry Title */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">
              Entry Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., A Breakthrough in Architecture & Mindfulness"
              className="w-full px-4 py-3.5 rounded-2xl border text-base focus:outline-none shadow-inner font-theme-heading font-semibold"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)'
              }}
              required
            />
          </div>

          {/* Highlights Editor */}
          <div className="space-y-2">
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

          {/* Gratitude Editor */}
          <div className="space-y-2">
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

          {/* Better Day Thoughts Editor */}
          <div className="space-y-2">
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

          {/* Category Ratings Section */}
          <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="text-lg font-bold font-theme-heading">Category & Pillar Ratings (1 - 5)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="p-4 rounded-2xl border flex items-center justify-between shadow-sm"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                >
                  <span className="text-sm font-semibold">{cat.name}</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleRatingChange(cat.id, star)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
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
              ))}
            </div>
          </div>

        </form>

      </main>

      <Footer />
    </div>
  );
}