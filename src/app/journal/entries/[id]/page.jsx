'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useJournalStore } from '@/store/useJournalStore';
import { BookOpenIcon, ArrowLeftIcon, CalendarIcon, StarIcon, SparklesIcon, TagIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentEntry, fetchEntryById, loading } = useJournalStore();
  const entryId = params?.id;

  useEffect(() => {
    if (entryId) {
      fetchEntryById(entryId);
    }
  }, [entryId, fetchEntryById]);

  // Helper to safely render Editor.js JSON blocks into HTML/JSX elements
  const renderEditorBlocks = (jsonString) => {
    if (!jsonString) return <p className="text-sm opacity-60">No content provided.</p>;
    
    try {
      const blocks = JSON.parse(jsonString);
      if (!Array.isArray(blocks)) return <p className="text-sm">{jsonString}</p>;

      return blocks.map((block, index) => {
        switch (block.type) {
          case 'header':
            const Tag = `h${block.data.level || 3}`;
            return React.createElement(Tag, {
              key: index,
              className: "text-xl font-bold font-theme-heading mt-4 mb-2"
            }, block.data.text);
          case 'paragraph':
            return <p key={index} className="text-sm leading-relaxed mb-3 opacity-90" dangerouslySetInnerHTML={{ __html: block.data.text }} />;
          case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={index} className={`list-${block.data.style === 'ordered' ? 'decimal' : 'disc'} pl-5 mb-3 space-y-1 text-sm opacity-90`}>
                {block.data.items.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: typeof item === 'string' ? item : item.content }} />
                ))}
              </ListTag>
            );
          case 'quote':
            return (
              <blockquote key={index} className="border-l-4 pl-4 italic my-4 text-sm opacity-80" style={{ borderColor: 'var(--accent)' }}>
                "{block.data.text}"
                {block.data.caption && <footer className="text-xs mt-1 not-italic opacity-60">— {block.data.caption}</footer>}
              </blockquote>
            );
          case 'delimiter':
            return <hr key={index} className="my-6 border-t opacity-20" style={{ borderColor: 'var(--border-color)' }} />;
          default:
            return <p key={index} className="text-sm mb-2">{block.data?.text || ''}</p>;
        }
      });
    } catch (e) {
      // Fallback if rendered as regular text string
      return <p className="text-sm leading-relaxed opacity-90">{jsonString}</p>;
    }
  };

  if (loading && !currentEntry) {
    return (
      <div className="min-h-screen flex flex-col font-theme-body" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-sm opacity-60">Loading entry details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentEntry) {
    return (
      <div className="min-h-screen flex flex-col font-theme-body" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center space-y-4 px-6">
          <BookOpenIcon className="h-12 w-12 opacity-40" style={{ color: 'var(--accent)' }} />
          <h2 className="text-2xl font-bold font-theme-heading">Entry Not Found</h2>
          <p className="text-sm opacity-70">The journal entry you are looking for does not exist or has been removed.</p>
          <Link
            href="/journal/entries"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
          >
            Back to All Entries
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
    >
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full space-y-10">
        
        {/* Back Link, Edit Button & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-semibold transition-opacity opacity-75 hover:opacity-100"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back</span>
            </button>

            <Link
              href={`/journal/entries/${entryId}/edit`}
              className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:scale-105"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-color)', 
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)'
              }}
            >
              <PencilSquareIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              <span>Edit Entry</span>
            </Link>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs opacity-60 font-mono">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{new Date(currentEntry.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
          <h1 className="text-3xl sm:text-4xl font-bold font-theme-heading tracking-tight" style={{ color: 'var(--text-main)' }}>
            {currentEntry.title}
          </h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          
          {/* Highlights */}
          {currentEntry.highlights && (
            <div 
              className="p-8 rounded-3xl border shadow-sm space-y-3"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                <SparklesIcon className="h-4 w-4" />
                <span>Highlights</span>
              </h3>
              <div className="leading-relaxed">
                {renderEditorBlocks(currentEntry.highlights)}
              </div>
            </div>
          )}

          {/* Gratitude */}
          {currentEntry.gratitude && (
            <div 
              className="p-8 rounded-3xl border shadow-sm space-y-3"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                <StarIcon className="h-4 w-4" />
                <span>Gratitude</span>
              </h3>
              <div className="leading-relaxed">
                {renderEditorBlocks(currentEntry.gratitude)}
              </div>
            </div>
          )}

          {/* Better Day Thoughts */}
          {currentEntry.better_day_thoughts && (
            <div 
              className="p-8 rounded-3xl border shadow-sm space-y-3"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                <BookOpenIcon className="h-4 w-4" />
                <span>Reflection & Improvements</span>
              </h3>
              <div className="leading-relaxed">
                {renderEditorBlocks(currentEntry.better_day_thoughts)}
              </div>
            </div>
          )}

          {/* Category Sections & Ratings */}
          {currentEntry.category_sections && currentEntry.category_sections.length > 0 && (
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-lg font-bold font-theme-heading">Category Ratings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentEntry.category_sections.map((section, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl border flex items-center justify-between shadow-sm"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4 opacity-50" style={{ color: 'var(--accent)' }} />
                      <span className="text-sm font-semibold">{section.category_name || 'Category'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold">{section.rating_score || 0} / 5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
}