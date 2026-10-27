'use client';

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { useNotificationStore } from '@/store/useNotificationStore';
import { 
  BellIcon, 
  CheckIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function NotificationClient() {
  const { notifications, fetchNotifications, markAsRead, deleteNotification, loading } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    const result = await markAsRead(id);
    if (result.success) {
      toast.success('Notification marked as read.');
    } else {
      toast.error(result.error || 'Failed to update notification.');
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteNotification(id);
    if (result.success) {
      toast.success('Notification deleted.');
    } else {
      toast.error(result.error || 'Failed to delete notification.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <AuthGuard>
      <div 
        className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
      >
        <Header />

        <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full space-y-8">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
                <BellIcon className="h-3.5 w-3.5" />
                <span>Alerts & Updates</span>
              </div>
              <h1 className="text-3xl font-bold font-theme-heading tracking-tight">Notifications</h1>
              <p className="text-sm opacity-80 mt-1" style={{ color: 'var(--text-muted)' }}>
                You have <span className="font-bold" style={{ color: 'var(--accent)' }}>{unreadCount}</span> unread {unreadCount === 1 ? 'notification' : 'notifications'}.
              </p>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {loading && notifications.length === 0 ? (
              <p className="text-sm opacity-60 py-12 text-center">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <div className="text-center py-16 space-y-4 border rounded-3xl" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                <BellIcon className="h-12 w-12 mx-auto opacity-40" style={{ color: 'var(--accent)' }} />
                <h3 className="text-lg font-bold font-theme-heading">All caught up!</h3>
                <p className="text-xs opacity-75 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
                  You don't have any notifications right now. Check back later for reminders and updates.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    notification.is_read ? 'opacity-75' : 'shadow-md ring-1 ring-[var(--accent)]/30'
                  }`}
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-2xl border shrink-0 mt-0.5"
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
                    >
                      <InformationCircleIcon className="h-5 w-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold font-theme-heading" style={{ color: 'var(--text-main)' }}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', borderColor: 'var(--border-color)' }}>
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed opacity-90" style={{ color: 'var(--text-muted)' }}>
                        {notification.message}
                      </p>
                      <span className="text-[10px] font-mono opacity-50 block pt-1">
                        {new Date(notification.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!notification.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all hover:scale-105 cursor-pointer"
                        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
                        title="Mark as Read"
                      >
                        <CheckIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Mark Read</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                      title="Delete Notification"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}