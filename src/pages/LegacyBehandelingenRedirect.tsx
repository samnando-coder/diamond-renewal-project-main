import { Navigate, useLocation } from 'react-router-dom';

const LEGACY_PATH_REDIRECTS: Record<string, string> = {
  // Deep nested legacy path -> new path
  '/behandelingen/gezichtsbehandelingen/permanent-make-up/': '/behandelingen/permanent-make-up',

  // Category pages that we handle elsewhere
  '/behandelingen/haar/': '/haar',
};

export default function LegacyBehandelingenRedirect() {
  const { pathname } = useLocation();
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;

  const to = LEGACY_PATH_REDIRECTS[normalized] ?? '/behandelingen';
  return <Navigate to={to} replace />;
}

