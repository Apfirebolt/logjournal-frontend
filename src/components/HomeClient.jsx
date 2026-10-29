'use client';

import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  SparklesIcon, 
  PencilSquareIcon, 
  TagIcon, 
  ChartBarIcon, 
  ArrowRightIcon, 
  BookOpenIcon,
  LightBulbIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import AOS from 'aos';
import 'aos/dist/aos.css';

const sliderImages = [
  {
    url: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=2070&q=80",
    title: "Mindful Daily Reflections",
    subtitle: "Capture your thoughts of the day."
  },
  {
    url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=2075&q=80",
    title: " Categorized and Structured Writing",
    subtitle: "Organize your days across custom categories and habit tracking."
  },
  {
    url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=2068&q=80",
    title: "Track Growth Over Time",
    subtitle: "Review past entries and visualize your personal progress with analytics."
  }
];

export default function HomeClient() {
  const { user, isAuthenticated, initializeAuth } = useAuthStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-out-cubic',
    });
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  return (
    <div className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-main)',
      }}
    >
      <Header />

      <main className="flex-grow">
        {/* Hero Section with Unsplash Background Image Slider */}
        <section className="relative overflow-hidden py-28 lg:py-40 px-6 flex items-center justify-center min-h-[700px]">
          
          <div className="absolute inset-0 z-0">
            {sliderImages.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img 
                  src={slide.url} 
                  alt={slide.title} 
                  className="w-full h-full object-cover object-center transform scale-105 filter brightness-75 dark:brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/75 backdrop-blur-[2px]" />
              </div>
            ))}
          </div>

          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none opacity-30 z-20"
            style={{ backgroundColor: 'var(--accent)' }}
          />

          <div className="max-w-5xl mx-auto text-center relative z-30 space-y-8">
            
            <div 
              data-aos="fade-down"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium backdrop-blur-md shadow-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff'
              }}
            >
              <SparklesIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              <span>{isAuthenticated && user ? `Welcome back, ${user.name || user.email || 'Friend'}!` : 'Mindfulness & Productivity Combined'}</span>
            </div>

            <div data-aos="fade-up" data-aos-delay="100" className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-theme-heading tracking-tight leading-tight text-white drop-shadow-md">
                {sliderImages[currentSlide].title}
              </h1>
              <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-gray-200 drop-shadow">
                {sliderImages[currentSlide].subtitle}
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/journal/new"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold font-theme-heading transition-all shadow-xl flex items-center justify-center gap-2 group hover:scale-105"
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
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold font-theme-heading border transition-all flex items-center justify-center gap-2 backdrop-blur-md text-white hover:bg-white/10"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }}
              >
                <BookOpenIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                <span>Browse Past Entries</span>
              </Link>

              {isAuthenticated && (
                <Link
                  href="/analytics"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold font-theme-heading border transition-all flex items-center justify-center gap-2 backdrop-blur-md text-white hover:bg-white/10"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <ChartBarIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                  <span>View Analytics</span>
                </Link>
              )}
            </div>

            <div className="flex items-center justify-center gap-6 pt-6">
              <button 
                onClick={prevSlide}
                className="p-2 rounded-full backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                {sliderImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentSlide ? 'w-8 bg-[var(--accent)]' : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextSlide}
                className="p-2 rounded-full backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>

          </div>
        </section>

        {/* Features / Architecture Highlights Section */}
        <section 
          className="py-24 px-6 border-t transition-colors"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4" data-aos="fade-up">
              <h2 className="text-3xl sm:text-4xl font-bold font-theme-heading">
                Designed for Daily Reflection
              </h2>
              <p className="max-w-xl mx-auto opacity-80" style={{ color: 'var(--text-muted)' }}>
                Everything you need to maintain a consistent journaling habit, tailored to your personal categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div 
                data-aos="fade-up"
                data-aos-delay="100"
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
                  Track default system generated journal sections like Work, Health, and Family, or add custom tags like Friends or Hobbies with individual scores.
                </p>
              </div>

              <div 
                data-aos="fade-up"
                data-aos-delay="200"
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
                  Medium-Style Editor
                </h3>
                <p className="text-sm leading-relaxed opacity-80" style={{ color: 'var(--text-muted)' }}>
                  Express yourself cleanly using block-based rich text, multi-level headers, tables, quotes, and code snippets.
                </p>
              </div>

              <div 
                data-aos="fade-up"
                data-aos-delay="300"
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