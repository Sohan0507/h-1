import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { FullPageError, FullPageLoader } from '../components/StatusScreens';
import { HomePage } from './HomePage';
import { PatientLoginPage } from './PatientLoginPage';
import { PatientPortalPage } from './PatientPortalPage';

// The public site has no staff or admin routes at all; staff use the separate
// staff app (staff.html), which is built and deployed on its own.
export const PublicApp: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<PatientLoginPage />} />
    <Route path="/my" element={<RequirePatient><PatientPortalPage /></RequirePatient>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

// UI guard only; the database enforces access regardless of what the browser shows.
const RequirePatient: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { session, profile, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!session) return <Navigate to="/login" replace />;
  if (profile && profile.role !== 'PATIENT') {
    return (
      <FullPageError
        title="This is the patient portal"
        message="Hospital staff accounts sign in through the staff app, not the public website."
        action={<Link to="/" className="inline-block text-sm font-bold text-blue-600 hover:underline">Back to website</Link>}
      />
    );
  }
  return children;
};

const NotFound: React.FC = () => (
  <FullPageError
    title="Page not found"
    message="The page you were looking for does not exist."
    action={<Link to="/" className="inline-block text-sm font-bold text-blue-600 hover:underline">Go to the home page</Link>}
  />
);
