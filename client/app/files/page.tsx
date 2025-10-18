"use client";
import { useEffect, useState } from 'react';
import { api, setAuth } from '@/lib/api';

export default function FilesPage() {
  const [token, setToken] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => setAuth(token), [token]);

  const login = async () => {
    const res = await api.post('/api/auth/login', { email: 'alice@example.com', password: 'password123' });
    setToken(res.data.token);
  };

  const list = async () => {
    const res = await api.get('/api/files/list');
    setFiles(res.data);
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    await api.post('/api/files/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    await list();
  };

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Files</h1>
      {!token ? (<button className="px-3 py-1 border rounded" onClick={login}>Login</button>) : (<div className="text-sm">Logged in</div>)}
      <input type="file" onChange={upload} />
      <button className="px-3 py-1 border rounded" onClick={list}>Refresh</button>
      <ul className="list-disc pl-6">
        {files.map((f) => (
          <li key={f.name}><a className="text-blue-600" href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${f.url}`} target="_blank">{f.name}</a></li>
        ))}
      </ul>
    </main>
  );
}
