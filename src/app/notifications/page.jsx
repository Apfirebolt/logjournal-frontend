import NotificationClient from './NotificationClient';

export const metadata = {
  title: 'Notifications | Log Journal',
  description: 'View and manage your application alerts and updates.',
};

export default function NotificationsPage() {
  return <NotificationClient />;
}