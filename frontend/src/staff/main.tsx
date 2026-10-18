import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { NotConfigured } from '../components/StatusScreens';
import { AuthProvider } from '../lib/auth';
import { isSupabaseConfigured } from '../lib/supabase';
import { StaffApp } from './StaffApp';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      {isSupabaseConfigured ? (
        <AuthProvider>
          <BrowserRouter>
            <StaffApp />
          </BrowserRouter>
        </AuthProvider>
      ) : (
        <NotConfigured />
      )}
    </ErrorBoundary>
  </React.StrictMode>
);
