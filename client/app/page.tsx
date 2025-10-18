import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">GlobalSmart Hub</h1>
      <p className="mb-6">Offline-first real-time AI platform.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-900" href="/chat">Chat</Link>
        <Link className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-900" href="/analytics">Analytics</Link>
        <Link className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-900" href="/files">Files</Link>
        <Link className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-900" href="/notifications">Notifications</Link>
        <Link className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-900" href="/settings">Settings</Link>
      </div>
    </main>
  );
}
