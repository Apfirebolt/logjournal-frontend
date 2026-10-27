import HomeClient from "@/components/HomeClient";

export const metadata = {
  title: 'Log Journal | Capture Your Days, Reflect & Grow',
  description: 'A flexible daily journal powered by custom categories, Medium-style block text prompts, and daily category ratings to help you understand your patterns.',
  keywords: 'journal, daily log, mindfulness, productivity, habit tracking, rich text editor',
  openGraph: {
    title: 'Log Journal | Mindfulness & Productivity Combined',
    description: 'Capture your days, reflect and grow with custom categories and structured daily logs.',
    type: 'website',
  },
};

export default function Page() {
  return <HomeClient />;
}