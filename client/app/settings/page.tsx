"use client";
import { useEffect, useState } from 'react';
import { api, setAuth } from '@/lib/api';

export default function SettingsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => setAuth(token), [token]);

  const login = async () => {
    const res = await api.post('/api/auth/login', { email: 'alice@example.com', password: 'password123' });
    setToken(res.data.token);
  };

  const load = async () => {
    const res = await api.get('/api/settings/1');
    setSettings(res.data);
  };

  const save = async () => {
    await api.put('/api/settings/1', settings);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      {!token ? (<button className="px-3 py-1 border rounded" onClick={login}>Login</button>) : (<div className="text-sm">Logged in</div>)}
      <div className="space-y-2">
        <label className="block">
          <span className="text-sm">Theme</span>
          <select
            className="border rounded px-2 py-1"
            value={settings.theme || ''}
            onChange={(e) => setSettings((s: any) => ({ ...s, theme: e.target.value }))}
          >
            <option value="">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm">Language</span>
          <select
            className="border rounded px-2 py-1"
            value={settings.language || ''}
            onChange={(e) => setSettings((s: any) => ({ ...s, language: e.target.value }))}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </label>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1 border rounded" onClick={load}>Load</button>
        <button className="px-3 py-1 border rounded" onClick={save}>Save</button>
      </div>
    </main>
  );
}
