import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { NotConfigured } from '../components/StatusScreens';
import { AuthProvider } from '../lib/auth';
import { isSupabaseConfigured } from '../lib/supabase';
import { PublicApp } from './PublicApp';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      {isSupabaseConfigured ? (
        <AuthProvider>
          <BrowserRouter>
            <PublicApp />
          </BrowserRouter>
        </AuthProvider>
      ) : (
        <NotConfigured />
      )}
    </ErrorBoundary>
  </React.StrictMode>
);
