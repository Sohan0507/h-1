import React from 'react';
import { ShieldCheck } from 'lucide-react';

// Shared frame for the staff sign-in, MFA and password screens.
export const StaffCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-10">
    <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-black">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  </div>
);

export const staffInputClass =
  'w-full min-h-[44px] bg-slate-50 border border-slate-300 text-slate-900 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500';

export const StaffAlert: React.FC<{ tone?: 'error' | 'info'; children: React.ReactNode }> = ({ tone = 'error', children }) => (
  <div
    role={tone === 'error' ? 'alert' : 'status'}
    className={`p-3 rounded-xl text-xs font-semibold border ${tone === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}
  >
    {children}
  </div>
);
