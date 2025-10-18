"use client";
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api, setAuth } from '@/lib/api';

export default function NotificationsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => setAuth(token), [token]);

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000');
    s.on('notification:new', (n) => setItems((prev) => [n, ...prev]));
    return () => s.disconnect();
  }, []);

  const login = async () => {
    const res = await api.post('/api/auth/login', { email: 'alice@example.com', password: 'password123' });
    setToken(res.data.token);
  };

  const load = async () => {
    const res = await api.get('/api/notifications');
    setItems(res.data);
  };

  const create = async () => {
    await api.post('/api/notifications', { userId: 1, title: 'Hello', body: 'Welcome to GlobalSmart Hub!' });
  };

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      {!token ? (<button className="px-3 py-1 border rounded" onClick={login}>Login</button>) : (<div className="text-sm">Logged in</div>)}
      <div className="flex gap-2">
        <button className="px-3 py-1 border rounded" onClick={load}>Load</button>
        <button className="px-3 py-1 border rounded" onClick={create}>Create sample</button>
      </div>
      <ul className="space-y-2">
        {items.map((n) => (
          <li key={n.id} className="border rounded p-3">
            <div className="font-medium">{n.title}</div>
            <div className="text-sm">{n.body}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
