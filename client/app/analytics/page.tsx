"use client";
import { useEffect, useState } from 'react';
import { api, setAuth } from '@/lib/api';
import { io } from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any>({ messageCount: 0, usersCount: 0, last10: [] });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => { setAuth(token); }, [token]);

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000');
    s.on('analytics:update', () => load());
    return () => s.disconnect();
  }, []);

  const login = async () => {
    const res = await api.post('/api/auth/login', { email: 'alice@example.com', password: 'password123' });
    setToken(res.data.token);
  };
  const load = async () => {
    const res = await api.get('/api/analytics/metrics');
    setMetrics(res.data);
  };

  const data = metrics.last10.map((l: any, idx: number) => ({ name: idx, value: 1 }));

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      {!token ? (<button className="px-3 py-1 border rounded" onClick={login}>Login</button>) : (<div className="text-sm">Logged in</div>)}
      <div className="flex gap-4">
        <button className="px-3 py-1 border rounded" onClick={load}>Load metrics</button>
        <div className="text-sm">Messages: {metrics.messageCount} | Users: {metrics.usersCount}</div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
