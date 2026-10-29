'use client';

import { useState, useEffect } from 'react';
import { TagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useJournalStore } from '@/store/useJournalStore';

export default function TagSelector({ selectedTags = [], onChange }) {
  const { tags: availableTags, fetchTags } = useJournalStore();
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleAddTag = (tagName) => {
    const trimmed = tagName.trim();
    if (!trimmed) return;
    if (selectedTags.includes(trimmed)) return;
    if (selectedTags.length >= 5) {
      alert('You can only associate a maximum of 5 tags per journal entry.');
      return;
    }
    onChange([...selectedTags, trimmed]);
    setInputVal('');
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(selectedTags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(inputVal);
    }
  };

  return (
    <div 
      className="p-6 rounded-3xl border shadow-sm space-y-4"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <TagIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          <h3 className="text-lg font-bold font-theme-heading uppercase tracking-wider">Entry Tags</h3>
        </div>
        <span className="opacity-70">
          {selectedTags.length}/5 selected
        </span>
      </div>

      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border shadow-2xs"
            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:opacity-70 cursor-pointer"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        {selectedTags.length === 0 && (
          <p className="italic opacity-50">No tags added yet. Select from below or type a new one.</p>
        )}
      </div>

      {/* Input Field for Custom Tag */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a tag and press Enter..."
          disabled={selectedTags.length >= 5}
          className="flex-grow px-4 py-2.5 rounded-xl border focus:outline-none shadow-inner font-theme-body"
          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        />
        <button
          type="button"
          onClick={() => handleAddTag(inputVal)}
          disabled={selectedTags.length >= 5 || !inputVal.trim()}
          className="px-4 py-2.5 rounded-xl font-bold border transition-all cursor-pointer hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
        >
          Add
        </button>
      </div>

      {/* Existing User Tags Quick Selector */}
      {availableTags.length > 0 && (
        <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <p className="font-bold uppercase tracking-wider opacity-60 font-theme-heading">Existing Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map((t) => {
              const isSelected = selectedTags.includes(t.name);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => !isSelected && handleAddTag(t.name)}
                  disabled={isSelected || selectedTags.length >= 5}
                  className={`px-3 py-1 rounded-lg font-medium border transition-all cursor-pointer ${
                    isSelected ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--border-color)' : 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: isSelected ? 'var(--text-muted)' : 'var(--text-main)',
                  }}
                >
                  +{t.name} {isSelected ? '✓' : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}