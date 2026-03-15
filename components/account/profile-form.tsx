'use client';

import { useState } from 'react';

export function ProfileForm({ displayName, email }: { displayName: string; email: string }) {
  const [name, setName] = useState(displayName);
  const [bio, setBio] = useState('Ricercatore o contributor impegnato nella mappatura delle scritture digitali della moda mediterranea.');
  const [status, setStatus] = useState('');

  async function onSave() {
    setStatus('Salvataggio in corso...');
    const response = await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: name, bio })
    });
    const data = await response.json();
    setStatus(response.ok ? 'Profilo aggiornato.' : data.error ?? 'Errore aggiornamento profilo.');
  }

  return (
    <div className="atlas-card grid gap-3 max-w-xl">
      <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-2xl border border-atlas-muted px-4 py-3" />
      <input value={email} readOnly className="rounded-2xl border border-atlas-muted bg-neutral-50 px-4 py-3 text-neutral-500" />
      <textarea value={bio} onChange={(event) => setBio(event.target.value)} className="min-h-32 rounded-2xl border border-atlas-muted px-4 py-3" />
      <button type="button" onClick={onSave} className="atlas-link-primary w-fit">Salva modifiche</button>
      {status ? <p className="text-sm text-neutral-700">{status}</p> : null}
    </div>
  );
}
