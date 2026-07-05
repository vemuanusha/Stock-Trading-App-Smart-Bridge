import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../redux/slices/authSlice';

export default function Register() {
  const [name, setName] = useState('');
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
    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! You start with $100,000 in virtual cash.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8">
        <h1 className="font-display text-2xl font-semibold mb-1">Create your account</h1>
        <p className="text-muted text-sm mb-6">Start with $100,000 in virtual cash.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-muted block mb-1">Full name</label>
            <input required className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Trader" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Email</label>
            <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Password</label>
            <input type="password" required minLength={6} className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn btn-buy w-full">
            {status === 'loading' ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-muted mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-mint hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
