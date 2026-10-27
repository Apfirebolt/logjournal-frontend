import AnalyticsClient from './AnalyticsClient';

export const metadata = {
  title: 'Journal Analytics | Log Journal',
  description: 'View your journaling streaks and life balance analytics.',
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}