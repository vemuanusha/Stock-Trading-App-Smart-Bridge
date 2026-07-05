import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../redux/slices/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8">
        <h1 className="font-display text-2xl font-semibold mb-1">Log in</h1>
        <p className="text-muted text-sm mb-6">Trade the market with virtual funds.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-muted block mb-1">Email</label>
            <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Password</label>
            <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn btn-buy w-full">
            {status === 'loading' ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="text-sm text-muted mt-6 text-center">
          New here?{' '}
          <Link to="/register" className="text-mint hover:underline">Create an account</Link>
        </p>

        <div className="mt-6 pt-4 border-t border-border text-xs text-muted">
          Demo admin: <span className="font-mono text-text">admin@stocksim.com</span> / <span className="font-mono text-text">admin123</span>
          <br />(after running <span className="font-mono">npm run seed</span> in the backend)
        </div>
      </div>
    </div>
  );
}
