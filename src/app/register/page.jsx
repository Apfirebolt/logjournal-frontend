"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ArrowRightIcon,
  LockClosedIcon,
  EnvelopeIcon,
  UserIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error } = useAuthStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");

    if (!username || !email || !password) {
      setLocalError("Please enter username, email and password.");
      return;
    }

    const result = await register({ username, email, password });

    if (result.success) {
      router.push("/");
    }
  }

  return (
    <div 
      className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-main)',
      }}
    >
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12">
        {/* Unified Single Container */}
        <div
          data-aos="fade-up"
          className="w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Left Side: Form Fields */}
          <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
            
            {/* Brand Header */}
            <div
              className="flex flex-col items-center justify-center space-y-2 mb-2"
              data-aos="fade-down"
              data-aos-delay="100"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-1"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                <BookOpenIcon className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight font-theme-heading">
                Log<span style={{ color: 'var(--accent)' }}>Journal</span>
              </h1>
              <p className="text-xs font-theme-body leading-relaxed text-center opacity-80" style={{ color: 'var(--text-muted)' }}>
                Create your account to start tracking your daily reflections and category growth.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 font-theme-body"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {(error || localError) && (
                <div className="text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl font-medium">
                  {localError || error}
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="username"
                  className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80"
                  style={{ color: 'var(--text-main)' }}
                >
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-40" style={{ color: 'var(--text-main)' }}>
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border focus:outline-none transition-colors shadow-inner"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-main)',
                    }}
                    placeholder="your-username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80"
                  style={{ color: 'var(--text-main)' }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-40" style={{ color: 'var(--text-main)' }}>
                    <EnvelopeIcon className="h-4 w-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border focus:outline-none transition-colors shadow-inner"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-main)',
                    }}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80"
                  style={{ color: 'var(--text-main)' }}
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-40" style={{ color: 'var(--text-main)' }}>
                    <LockClosedIcon className="h-4 w-4" />
                  </span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border focus:outline-none transition-colors shadow-inner"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-main)',
                    }}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer mt-2 rounded-xl font-theme-heading hover:opacity-90"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)',
                }}
              >
                <span>
                  {loading ? "Creating account..." : "Create account"}
                </span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </form>

            {/* Footer Link */}
            <div
              className="text-center text-xs font-theme-body pt-4 border-t opacity-80"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
              data-aos="fade-in"
              data-aos-delay="300"
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Right Side: Journal-Themed Background Image Container */}
          <div className="hidden lg:relative lg:flex items-center justify-center p-6 overflow-hidden min-h-[480px]">
            <div className="absolute inset-4 rounded-2xl overflow-hidden shadow-inner border" style={{ borderColor: 'var(--border-color)' }}>
              <Image
                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop"
                alt="Journal Writing Experience"
                fill
                priority
                className="object-cover opacity-90 scale-105 hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <blockquote className="space-y-2">
                  <p className="text-sm italic font-theme-body text-gray-200">
                    "Fill your paper with the breathings of your heart."
                  </p>
                  <footer className="text-xs opacity-75 font-theme-heading tracking-wide uppercase">
                    — William Wordsworth
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}