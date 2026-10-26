import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { 
  SparklesIcon, 
  PencilSquareIcon, 
  TagIcon, 
  ChartBarIcon, 
  ArrowRightIcon, 
  BookOpenIcon,
  HeartIcon,
  LightBulbIcon
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "LogJournal | Mindful Daily Journaling & Reflection",
  description: "Track your daily life, rate performance across categories like work, health, and friends, and reflect with custom block-based prompts.",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-main)',
      }}
    >
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32 px-6">
          {/* Subtle background glow effect using theme accent */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none opacity-20"
            style={{ backgroundColor: 'var(--accent)' }}
          />

          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
            <div 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium backdrop-blur-sm shadow-sm"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--accent)'
              }}
            >
              <SparklesIcon className="h-4 w-4" />
              <span>Mindfulness & Productivity Combined</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-theme-heading tracking-tight leading-tight">
              Capture Your Days, <span style={{ color: 'var(--accent)' }}>Reflect & Grow.</span>
            </h1>

            <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed opacity-80" style={{ color: 'var(--text-muted)' }}>
              A flexible daily journal powered by custom categories, block-based rich text prompts, and daily category ratings to help you understand your patterns.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/journal/new"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold font-theme-heading transition-all shadow-lg flex items-center justify-center gap-2 group hover:scale-105"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)',
                }}
              >
                <PencilSquareIcon className="h-5 w-5" />
                <span>Write Today's Entry</span>
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/journal/entries"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold font-theme-heading border transition-all flex items-center justify-center gap-2 hover:opacity-100 opacity-80"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              >
                <BookOpenIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                <span>Browse Past Entries</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features / Architecture Highlights Section */}
        <section 
          className="py-20 px-6 border-t transition-colors"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold font-theme-heading">
                Designed for Daily Reflection
              </h2>
              <p className="max-w-xl mx-auto opacity-80" style={{ color: 'var(--text-muted)' }}>
                Everything you need to maintain a consistent journaling habit, tailored to your personal categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div 
                className="p-8 rounded-3xl border space-y-4 transition-all hover:-translate-y-1 shadow-sm"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)' }}
                >
                  <TagIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-theme-heading">
                  Custom Categories
                </h3>
                <p className="text-sm leading-relaxed opacity-80" style={{ color: 'var(--text-muted)' }}>
                  Track default system pillars like Work, Health, and Family, or add custom tags like Friends or Hobbies with individual scores.
                </p>
              </div>

              {/* Feature 2 */}
              <div 
                className="p-8 rounded-3xl border space-y-4 transition-all hover:-translate-y-1 shadow-sm"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)' }}
                >
                  <LightBulbIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-theme-heading">
                  Rich HTML Prompts
                </h3>
                <p className="text-sm leading-relaxed opacity-80" style={{ color: 'var(--text-muted)' }}>
                  Express yourself freely using JSONB block storage and HTML support across highlights, gratitude, and daily thoughts.
                </p>
              </div>

              {/* Feature 3 */}
              <div 
                className="p-8 rounded-3xl border space-y-4 transition-all hover:-translate-y-1 shadow-sm"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)' }}
                >
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-theme-heading">
                  Rating Analytics
                </h3>
                <p className="text-sm leading-relaxed opacity-80" style={{ color: 'var(--text-muted)' }}>
                  Visualize your category scores over time to discover trends, balance your routine, and make every day better.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}