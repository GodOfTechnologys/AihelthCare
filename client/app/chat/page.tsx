"use client";
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api, setAuth } from '@/lib/api';

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number>(1);

  useEffect(() => {
    setAuth(token);
  }, [token]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000');
    socket.on('message:new', (m) => setMessages((prev) => [...prev, m]));
    return () => socket.disconnect();
  }, []);

  const login = async () => {
    const res = await api.post('/api/auth/login', { email: 'alice@example.com', password: 'password123' });
    setToken(res.data.token);
  };

  const load = async () => {
    const res = await api.get('/api/messages');
    setMessages(res.data);
  };

  const send = async () => {
    await api.post('/api/messages', { userId, content, language: 'en' });
    setContent('');
  };

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Chat</h1>
      {!token ? (
        <button className="px-3 py-1 border rounded" onClick={login}>Login as Alice</button>
      ) : (
        <div className="text-sm">Logged in</div>
      )}
      <div className="flex gap-2">
        <button className="px-3 py-1 border rounded" onClick={load}>Load history</button>
      </div>
      <div className="border rounded p-3 h-80 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <span className="font-medium">{m.senderType}:</span> {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type a message" />
        <button className="px-3 py-2 border rounded" onClick={send}>Send</button>
      </div>
    </main>
  );
}
