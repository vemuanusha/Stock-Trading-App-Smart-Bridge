import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-surface2 text-mint' : 'text-muted hover:text-text'
  }`;

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-ink/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <span className="font-display text-lg font-semibold tracking-tight text-text">
            Stock<span className="text-mint">Trade</span>
          </span>
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/stocks" className={linkClass}>Markets</NavLink>
              <NavLink to="/portfolio" className={linkClass}>Portfolio</NavLink>
              <NavLink to="/watchlist" className={linkClass}>Watchlist</NavLink>
              <NavLink to="/history" className={linkClass}>History</NavLink>
              <NavLink to="/trade-log" className={linkClass}>Trade Log</NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" className={linkClass}>Admin</NavLink>
              )}
            </nav>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-xs text-muted">Virtual balance</span>
              <span className="font-mono text-sm text-gold">
                ${user.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost">
              Log out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink to="/login" className="btn btn-ghost">Log in</NavLink>
            <NavLink to="/register" className="btn btn-buy">Get started</NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
