import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { StaffAlert, StaffCard, staffInputClass } from './StaffCard';

// Staff sign in with email + password, then an authenticator code (MfaPage).
// There is no sign-up here: accounts are created by admin invitation only.
export const StaffLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    setBusy(false);
    // Same message for unknown email and wrong password.
    if (signInError) setError('Incorrect email or password.');
  };

  const sendReset = async () => {
    setError(null);
    setNotice(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter your work email first.');
    setBusy(true);
    await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/welcome` });
    setBusy(false);
    setNotice('If that email belongs to a staff account, a reset link is on its way.');
  };

  return (
    <StaffCard title="Staff sign in" subtitle="We Care Multispeciality Hospital">
      {error && <StaffAlert>{error}</StaffAlert>}
      {notice && <StaffAlert tone="info">{notice}</StaffAlert>}
      <form onSubmit={signIn} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Work email</span>
          <input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className={staffInputClass} required />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Password</span>
          <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className={staffInputClass} required />
        </label>
        <button type="submit" disabled={busy} className="w-full min-h-[48px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign in
        </button>
      </form>
      <button type="button" onClick={sendReset} disabled={busy} className="w-full text-xs font-bold text-slate-500 hover:text-slate-800">
        Forgot password?
      </button>
      <p className="text-[11px] text-slate-400 text-center">Authorised hospital staff only. All access is logged.</p>
    </StaffCard>
  );
};
