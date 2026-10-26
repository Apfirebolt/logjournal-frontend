import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { SparklesIcon, MagnifyingGlassIcon, CpuChipIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "AnimeLounge | AI-Powered Anime Recommendations",
  description: "Discover your next favorite anime instantly using machine learning, cosine similarity matrices, and a high-performance FastAPI backend.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-anime-dark dark:text-anime-light flex flex-col font-sans selection:bg-anime-sage selection:text-anime-dark transition-colors duration-200">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32 px-6">
          {/* Subtle background glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-anime-sage/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-anime-sage/10 border border-anime-sage/20 text-anime-sage text-sm font-medium">
              <SparklesIcon className="h-4 w-4" />
              <span>Powered by Scikit-Learn</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-heading tracking-tight leading-tight">
              Discover Your Next <span className="text-anime-sage">Favorite Anime</span> Instantly.
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-anime-light/80 max-w-2xl mx-auto leading-relaxed">
              Explore thousands of titles indexed by plot synopses, genres, and studios. Built with a lightning-fast FastAPI backend and precomputed similarity matrices.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/anime"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold font-heading bg-anime-sage text-anime-dark hover:bg-anime-sage/90 transition-all shadow-lg shadow-anime-sage/10 flex items-center justify-center gap-2 group"
              >
                <span>Browse Anime</span>
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/manga"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold font-heading bg-anime-sage text-anime-dark hover:bg-anime-sage/90 transition-all shadow-lg shadow-anime-sage/10 flex items-center justify-center gap-2 group"
              >
                <span>Browse Manga</span>
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features / Engineering Highlights Section */}
        <section className="py-20 px-6 border-t border-gray-200 dark:border-anime-sage/10 bg-gray-50 dark:bg-black/10">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold font-heading">
                Engineered for Performance
              </h2>
              <p className="text-gray-600 dark:text-anime-light/70 max-w-xl mx-auto">
                Designed with production-grade architecture principles to ensure seamless discovery and instant lookups.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-white dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/20 space-y-4 hover:border-anime-sage/50 transition-colors shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-anime-sage/10 flex items-center justify-center text-anime-sage">
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-heading">
                  Scikit-Learn Backend
                </h3>
                <p className="text-sm text-gray-600 dark:text-anime-light/80 leading-relaxed">
                  Leverages TF-IDF vectorization and cosine similarity across comprehensive metadata soups to find mathematically accurate matches.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-white dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/20 space-y-4 hover:border-anime-sage/50 transition-colors shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-anime-coral/10 flex items-center justify-center text-anime-coral">
                  <CpuChipIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-heading">
                  Precomputed Reads
                </h3>
                <p className="text-sm text-gray-600 dark:text-anime-light/80 leading-relaxed">
                  Top similarity arrays are precomputed and stored in relational database tables, bypassing heavy runtime calculation overhead.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-white dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/20 space-y-4 hover:border-anime-sage/50 transition-colors shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-anime-sage/10 flex items-center justify-center text-anime-sage">
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-heading">
                  Interactive Exploration
                </h3>
                <p className="text-sm text-gray-600 dark:text-anime-light/80 leading-relaxed">
                  A responsive Next.js frontend featuring real-time search filtering and instant title lookups displaying similar entities.
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