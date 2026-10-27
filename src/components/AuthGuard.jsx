"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { BookOpenIcon } from "@heroicons/react/24/outline";

export default function AuthGuard({ children }) {
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 1. Synchronously initialize auth state from cookies
    initializeAuth();

    // 2. Read latest auth state directly from store
    const authed = useAuthStore.getState().isAuthenticated;

    if (!authed) {
      router.replace("/login");
    } else {
      setIsChecking(false);
    }
  }, [initializeAuth, router]);

  // If still checking or not authenticated, render loading screen using journal theme variables
  if (isChecking || !isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center space-y-4 font-theme-body transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
      >
        <div 
          className="w-16 h-16 rounded-3xl flex items-center justify-center border animate-pulse shadow-lg"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--border-color)',
            color: 'var(--accent)'
          }}
        >
          <BookOpenIcon className="h-8 w-8 animate-bounce" />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-sm font-bold font-theme-heading">Verifying Security Session...</p>
          <p className="text-xs opacity-70 font-theme-body" style={{ color: 'var(--text-muted)' }}>
            Securing your journal reflections
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}