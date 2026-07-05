import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

export default function AdminPanel() {
  const [tab, setTab] = useState('stocks');
  const [stocks, setStocks] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({ symbol: '', name: '', sector: '', price: '' });

  const loadStocks = useCallback(() => api.get('/stocks').then((r) => setStocks(r.data)).catch(() => {}), []);
  const loadUsers = useCallback(() => api.get('/admin/users').then((r) => setUsers(r.data)).catch(() => {}), []);
  const loadStats = useCallback(() => api.get('/admin/stats').then((r) => setStats(r.data)).catch(() => {}), []);

  useEffect(() => {
    loadStocks();
    loadUsers();
    loadStats();
  }, [loadStocks, loadUsers, loadStats]);

  const createStock = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stocks', { ...form, price: Number(form.price) });
      toast.success(`${form.symbol.toUpperCase()} added to the market`);
      setForm({ symbol: '', name: '', sector: '', price: '' });
      loadStocks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create stock');
    }
  };

  const updatePrice = async (stock, price) => {
    try {
      await api.put(`/stocks/${stock._id}`, { price: Number(price) });
      loadStocks();
    } catch (err) {
      toast.error('Price update failed');
    }
  };

  const deleteStock = async (stock) => {
    try {
      await api.delete(`/stocks/${stock._id}`);
      toast.info(`${stock.symbol} removed`);
      loadStocks();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const simulateTick = async () => {
    try {
      await api.post('/stocks/simulate-tick');
      toast.success('Simulated a market tick for all stocks');
      loadStocks();
    } catch (err) {
      toast.error('Simulation failed');
    }
  };

  const updateUserRole = async (user, role) => {
    try {
      await api.put(`/admin/users/${user._id}`, { role });
      toast.success(`${user.name} is now ${role}`);
      loadUsers();
    } catch (err) {
      toast.error('Could not update user');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Admin panel</h1>
        <p className="text-muted text-sm mt-1">Manage stocks, users, and monitor platform activity.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-xs text-muted mb-1">Total users</p>
            <p className="font-mono text-2xl">{stats.userCount}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs text-muted mb-1">Active stocks</p>
            <p className="font-mono text-2xl">{stats.stockCount}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs text-muted mb-1">Total transactions</p>
            <p className="font-mono text-2xl">{stats.transactionCount}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 border-b border-border">
        {['stocks', 'users', 'activity'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px ${
              tab === t ? 'border-mint text-mint' : 'border-transparent text-muted hover:text-text'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'stocks' && (
        <div className="space-y-6">
          <form onSubmit={createStock} className="card p-5 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div className="sm:col-span-1">
              <label className="text-xs text-muted block mb-1">Symbol</label>
              <input required className="input" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} placeholder="e.g. IBM" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted block mb-1">Company name</label>
              <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="International Business Machines" />
            </div>
            <div className="sm:col-span-1">
              <label className="text-xs text-muted block mb-1">Sector</label>
              <input className="input" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} placeholder="Technology" />
            </div>
            <div className="sm:col-span-1">
              <label className="text-xs text-muted block mb-1">Price</label>
              <input required type="number" step="0.01" min="0" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="150.00" />
            </div>
            <button type="submit" className="btn btn-buy sm:col-span-5">Add stock</button>
          </form>

          <div className="flex justify-end">
            <button onClick={simulateTick} className="btn btn-ghost">Simulate market tick</button>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="px-4 py-3 font-medium">Symbol</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium text-right">Price</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((s) => (
                  <tr key={s._id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-mono font-semibold">{s.symbol}</td>
                    <td className="px-4 py-3 text-muted">{s.name}</td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={s.price}
                        className="input !w-28 text-right inline-block"
                        onBlur={(e) => e.target.value != s.price && updatePrice(s, e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="btn btn-ghost !px-3 !py-1 text-xs text-coral" onClick={() => deleteStock(s)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium text-right">Balance</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3 text-right font-mono">${u.balance.toFixed(2)}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="btn btn-ghost !px-3 !py-1 text-xs"
                      onClick={() => updateUserRole(u, u.role === 'admin' ? 'user' : 'admin')}
                    >
                      Make {u.role === 'admin' ? 'user' : 'admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'activity' && stats && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Symbol</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentTransactions.map((t) => (
                <tr key={t._id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">{t.user?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 font-mono">{t.symbol}</td>
                  <td className="px-4 py-3">{t.type}</td>
                  <td className="px-4 py-3 text-right font-mono">${t.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
