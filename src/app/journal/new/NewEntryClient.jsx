"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import httpClient from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";
import HabitChecklist from "@/components/HabitCheckList";
import TagSelector from "@/components/TagSelector";
import { useJournalStore } from "@/store/useJournalStore";
import {
  PencilSquareIcon,
  CheckIcon,
  StarIcon,
  CalendarIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";

export default function NewEntryClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, fetchCategories, createEntry, loading } =
    useJournalStore();

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);

  const [journalDate, setJournalDate] = useState(() => {
    const paramDate = searchParams.get("date");
    if (paramDate) {
      return paramDate;
    }
    return new Date().toISOString().split("T")[0];
  });

  // Section visibility toggle state
  const [visibleSections, setVisibleSections] = useState({
    highlights: true,
    gratitude: true,
    thoughts: true,
    habits: true,
    categories: true,
  });

  const [activeCategories, setActiveCategories] = useState({});
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
      easing: "ease-out-cubic",
    });
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategories((prev) => {
        const next = { ...prev };
        categories.forEach((cat) => {
          if (next[cat.id] === undefined) {
            next[cat.id] = true;
          }
        });
        return next;
      });
    }
  }, [categories]);

  // Initialize Editors
  useEffect(() => {
    let isMounted = true;

    async function initEditors() {
      if (typeof window === "undefined") return;

      const EditorJS = (await import("@editorjs/editorjs")).default;
      const HeaderBlock = (await import("@editorjs/header")).default;
      const ParagraphBlock = (await import("@editorjs/paragraph")).default;
      const ListBlock = (await import("@editorjs/list")).default;
      const DelimiterBlock = (await import("@editorjs/delimiter")).default;
      const QuoteBlock = (await import("@editorjs/quote")).default;
      const MarkerBlock = (await import("@editorjs/marker")).default;
      const CodeBlock = (await import("@editorjs/code")).default;
      const TableBlock = (await import("@editorjs/table")).default;
      const ChecklistBlock = (await import("@editorjs/checklist")).default;
      const Link = (await import("@editorjs/link")).default;


      const editorTools = {
        header: {
          class: HeaderBlock,
          config: { levels: [2, 3, 4], defaultLevel: 2 },
        },
        paragraph: { class: ParagraphBlock, inlineToolbar: true },
        list: { class: ListBlock, inlineToolbar: true },
        quote: { class: QuoteBlock, inlineToolbar: true },
        delimiter: DelimiterBlock,
        marker: MarkerBlock,
        code: CodeBlock,
        table: TableBlock,
        checklist: ChecklistBlock,
        link: {
          class: Link,
          inlineToolbar: true,
          config: {
            endpoint: "",
          },
        }
      };

      if (
        visibleSections.highlights &&
        highlightsEditorRef.current &&
        !editorInstanceRef.current.highlights
      ) {
        editorInstanceRef.current.highlights = new EditorJS({
          holder: highlightsEditorRef.current,
          placeholder:
            "How was your day today?... What were your main highlights today?",
          tools: editorTools,
        });
      }

      if (
        visibleSections.gratitude &&
        gratitudeEditorRef.current &&
        !editorInstanceRef.current.gratitude
      ) {
        editorInstanceRef.current.gratitude = new EditorJS({
          holder: gratitudeEditorRef.current,
          placeholder: "What are you grateful for today?",
          tools: editorTools,
        });
      }

      if (
        visibleSections.thoughts &&
        thoughtsEditorRef.current &&
        !editorInstanceRef.current.thoughts
      ) {
        editorInstanceRef.current.thoughts = new EditorJS({
          holder: thoughtsEditorRef.current,
          placeholder: "How could today have been even better?",
          tools: editorTools,
        });
      }

      if (visibleSections.categories) {
        categories.forEach((cat) => {
          if (activeCategories[cat.id]) {
            const holderElement = categoryEditorsRefs.current[cat.id];
            if (
              holderElement &&
              !editorInstanceRef.current.categories[cat.id]
            ) {
              editorInstanceRef.current.categories[cat.id] = new EditorJS({
                holder: holderElement,
                placeholder: `Record notes, activities, or experiences for ${cat.name}...`,
                tools: editorTools,
              });
            }
          }
        });
      }
    }

    initEditors();

    return () => {
      isMounted = false;
    };
  }, [visibleSections, activeCategories, categories]);

  const handleRatingChange = (categoryId, score) => {
    setCategoryRatings((prev) => ({ ...prev, [categoryId]: score }));
  };

  const toggleSection = (key) => {
    setVisibleSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCategory = (catId) => {
    setActiveCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please provide a title for your journal entry.");
      return;
    }

    setIsSubmitting(true);

    try {
      const highlightsData =
        visibleSections.highlights && editorInstanceRef.current.highlights
          ? await editorInstanceRef.current.highlights.save()
          : null;
      const gratitudeData =
        visibleSections.gratitude && editorInstanceRef.current.gratitude
          ? await editorInstanceRef.current.gratitude.save()
          : null;
      const thoughtsData =
        visibleSections.thoughts && editorInstanceRef.current.thoughts
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
        highlights: highlightsData ? JSON.stringify(highlightsData.blocks) : "",
        gratitude: gratitudeData ? JSON.stringify(gratitudeData.blocks) : "",
        better_day_thoughts: thoughtsData
          ? JSON.stringify(thoughtsData.blocks)
          : "",
        category_sections,
        habits: visibleSections.habits ? habits : [],
        tags: tags, // Include tags in payload
      };

      const result = await createEntry(payload);

      if (result.success) {
        toast.success("Journal entry saved successfully!");
        router.push("/journal/entries");
      } else {
        toast.error(result.error || "Failed to save entry.");
      }
    } catch (err) {
      console.error("Editor save error:", err);
      toast.error("An error occurred while saving your entry.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthGuard>
      <div
        className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
        style={{
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-main)",
        }}
      >
        <Header />

        <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full space-y-10">
          <div
            className="flex items-center justify-between border-b pb-6"
            style={{ borderColor: "var(--border-color)" }}
            data-aos="fade-down"
          >
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold mb-2"
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--accent)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <PencilSquareIcon className="h-3.5 w-3.5" />
                <span>Journal Editor</span>
              </div>
              <h1 className="text-3xl font-bold font-theme-heading tracking-tight">
                New Journal Entry
              </h1>
              <p
                className="text-sm opacity-80 mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Customize your sections for your entry for {journalDate}.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--bg-primary)",
              }}
            >
              <CheckIcon className="h-5 w-5" />
              <span>{isSubmitting ? "Saving..." : "Save Entry"}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section Visibility Control Panel */}
            <div
              className="p-5 rounded-2xl border shadow-sm space-y-3"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
              data-aos="fade-up"
            >
              <div
                className="flex items-center gap-2 font-bold uppercase tracking-wider font-theme-heading opacity-80"
                style={{ color: "var(--accent)" }}
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                <span>Customize Entry Sections</span>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <label
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border font-medium cursor-pointer transition-colors"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={visibleSections.highlights}
                    onChange={() => toggleSection("highlights")}
                    className="rounded accent-[var(--accent)]"
                  />
                  <span>Highlights</span>
                </label>

                <label
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border font-medium cursor-pointer transition-colors"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={visibleSections.gratitude}
                    onChange={() => toggleSection("gratitude")}
                    className="rounded accent-[var(--accent)]"
                  />
                  <span>Grateful For</span>
                </label>

                <label
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border font-medium cursor-pointer transition-colors"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={visibleSections.thoughts}
                    onChange={() => toggleSection("thoughts")}
                    className="rounded accent-[var(--accent)]"
                  />
                  <span>Improvement</span>
                </label>

                <label
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border font-medium cursor-pointer transition-colors"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={visibleSections.habits}
                    onChange={() => toggleSection("habits")}
                    className="rounded accent-[var(--accent)]"
                  />
                  <span>To Do Checklist</span>
                </label>

                <label
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border font-medium cursor-pointer transition-colors"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={visibleSections.categories}
                    onChange={() => toggleSection("categories")}
                    className="rounded accent-[var(--accent)]"
                  />
                  <span>Custom Categories</span>
                </label>
              </div>
            </div>

            {/* Journal Date Input */}
            <div className="space-y-2" data-aos="fade-up" data-aos-delay="100">
              <label className="block text-lg font-bold uppercase tracking-wider font-theme-heading opacity-80 flex items-center gap-1.5">
                <CalendarIcon
                  className="h-4 w-4"
                  style={{ color: "var(--accent)" }}
                />
                <span>Journal Date</span>
              </label>
              <input
                type="date"
                value={journalDate}
                onChange={(e) => setJournalDate(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border text-sm focus:outline-none shadow-inner font-theme-heading font-semibold"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-main)",
                }}
                required
              />
            </div>

            {/* Story Title */}
            <div className="space-y-2" data-aos="fade-up" data-aos-delay="150">
              <label className="block text-lg font-bold uppercase tracking-wider font-theme-heading opacity-80">
                Journal Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Amazing day at work"
                className="w-full px-4 py-3.5 rounded-2xl border text-lg focus:outline-none shadow-inner font-theme-heading"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-main)",
                }}
                required
              />
            </div>

            {/* Tag Selector Component Integration */}
            <div data-aos="fade-up" data-aos-delay="175">
              <TagSelector selectedTags={tags} onChange={setTags} />
            </div>

            {/* Highlights Editor */}
            {visibleSections.highlights && (
              <div
                className="space-y-2"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <label className="block text-lg font-bold uppercase tracking-wider font-theme-heading opacity-80">
                  Highlights of today
                </label>
                <div
                  ref={highlightsEditorRef}
                  className="p-6 rounded-2xl border shadow-inner min-h-[160px]"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                    fontSize: "var(--text-lg)",
                  }}
                />
              </div>
            )}

            {/* Gratitude Editor */}
            {visibleSections.gratitude && (
              <div
                className="space-y-2"
                data-aos="fade-up"
                data-aos-delay="250"
              >
                <label className="block text-lg font-bold uppercase tracking-wider font-theme-heading opacity-80">
                  Things I'm grateful for today
                </label>
                <div
                  ref={gratitudeEditorRef}
                  className="p-6 rounded-2xl border shadow-inner min-h-[140px]"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                    fontSize: "var(--text-lg)",
                  }}
                />
              </div>
            )}

            {/* Better Day Thoughts Editor */}
            {visibleSections.thoughts && (
              <div
                className="space-y-2"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <label className="block text-lg font-bold uppercase tracking-wider font-theme-heading opacity-80">
                  How could today have been better?
                </label>
                <div
                  ref={thoughtsEditorRef}
                  className="p-6 rounded-2xl border shadow-inner min-h-[140px]"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                    fontSize: "var(--text-lg)",
                  }}
                />
              </div>
            )}

            {/* Habit Checklist Component Integration */}
            {visibleSections.habits && (
              <div data-aos="fade-up" data-aos-delay="350">
                <HabitChecklist habits={habits} onChange={setHabits} />
              </div>
            )}

            {/* Dynamic Category Sections & Ratings */}
            {visibleSections.categories && (
              <div
                className="space-y-6 pt-4 border-t"
                style={{ borderColor: "var(--border-color)" }}
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold font-theme-heading">
                      Category Sections
                    </h2>
                    <p
                      className="opacity-75 mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Customize your journal entry by selecting relevant
                      categories for today.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
                          activeCategories[cat.id] ? "shadow-sm" : "opacity-40"
                        }`}
                        style={{
                          backgroundColor: activeCategories[cat.id]
                            ? "var(--card-bg)"
                            : "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                          color: activeCategories[cat.id]
                            ? "var(--accent)"
                            : "var(--text-main)",
                        }}
                      >
                        {cat.name} {activeCategories[cat.id] ? "✓" : ""}
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
                        style={{
                          backgroundColor: "var(--card-bg)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <div
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3"
                          style={{ borderColor: "var(--border-color)" }}
                        >
                          <div className="flex items-center gap-2">
                            <TagIcon
                              className="h-5 w-5"
                              style={{ color: "var(--accent)" }}
                            />
                            <h3 className="text-lg font-bold font-theme-heading uppercase tracking-wider">
                              {cat.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold uppercase tracking-wider opacity-60">
                              Section Rating:
                            </span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() =>
                                    handleRatingChange(cat.id, star)
                                  }
                                  className="p-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                                >
                                  <StarIcon
                                    className={`h-5 w-5 ${
                                      (categoryRatings[cat.id] || 0) >= star
                                        ? "text-amber-400 fill-amber-400"
                                        : "opacity-30"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div
                          ref={(el) => {
                            categoryEditorsRefs.current[cat.id] = el;
                          }}
                          className="p-6 rounded-2xl border shadow-inner min-h-[140px]"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            borderColor: "var(--border-color)",
                            fontSize: "var(--text-lg)",
                          }}
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
