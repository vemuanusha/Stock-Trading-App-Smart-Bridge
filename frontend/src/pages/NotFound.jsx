import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-mono text-mint text-sm mb-2">404</p>
      <h1 className="font-display text-2xl font-semibold mb-2">Page not found</h1>
      <p className="text-muted mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn btn-buy">Back to dashboard</Link>
    </div>
  );
}
