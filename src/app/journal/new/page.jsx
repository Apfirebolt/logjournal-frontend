import { Suspense } from 'react';
import NewEntryClient from './NewEntryClient';

export const metadata = {
  title: 'New Journal Entry | Softgenie Journal',
  description: 'Create a new daily experience and track your category ratings.',
};

export default function NewEntryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-theme-body">
        <p className="text-sm opacity-60">Loading editor...</p>
      </div>
    }>
      <NewEntryClient />
    </Suspense>
  );
}