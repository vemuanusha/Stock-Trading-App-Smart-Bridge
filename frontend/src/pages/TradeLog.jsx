import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const emptyForm = { symbol: '', type: 'BUY', quantity: '', price: '', tradeDate: '', notes: '' };

export default function TradeLog() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/tradelog');
      setEntries(data);
    } catch (err) {
      toast.error('Failed to load trade log');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addEntry = async (e) => {
    e.preventDefault();
    if (!form.symbol || !form.quantity || !form.price) {
      toast.error('Symbol, quantity and price are required');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/tradelog', form);
      toast.success(`Added ${form.symbol.toUpperCase()} to your trade log`);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add trade');
    } finally {
      setSubmitting(false);
    }
  };

  const removeEntry = async (entry) => {
    try {
      await api.delete(`/tradelog/${entry._id}`);
      toast.info(`Removed ${entry.symbol} from your trade log`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete entry');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Trade log</h1>
        <p className="text-muted text-sm mt-1">
          A personal record of trades you want to track — adding or removing an entry here
          does not affect your balance or portfolio.
        </p>
      </div>

      <form onSubmit={addEntry} className="card p-5 grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
        <div className="sm:col-span-1">
          <label className="text-xs text-muted block mb-1">Symbol</label>
          <input required className="input" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} placeholder="AAPL" />
        </div>
        <div className="sm:col-span-1">
          <label className="text-xs text-muted block mb-1">Type</label>
          <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </div>
        <div className="sm:col-span-1">
          <label className="text-xs text-muted block mb-1">Quantity</label>
          <input required type="number" min="1" className="input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="10" />
        </div>
        <div className="sm:col-span-1">
          <label className="text-xs text-muted block mb-1">Price</label>
          <input required type="number" min="0" step="0.01" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="195.50" />
        </div>
        <div className="sm:col-span-1">
          <label className="text-xs text-muted block mb-1">Date</label>
          <input type="date" className="input" value={form.tradeDate} onChange={(e) => setForm({ ...form, tradeDate: e.target.value })} />
        </div>
        <div className="sm:col-span-1">
          <button type="submit" disabled={submitting} className="btn btn-buy w-full">
            {submitting ? 'Adding…' : 'Add trade'}
          </button>
        </div>
        <div className="sm:col-span-6">
          <label className="text-xs text-muted block mb-1">Notes (optional)</label>
          <input className="input" maxLength={500} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Why you made this trade, what you'd do differently, etc." />
        </div>
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Symbol</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium text-right">Qty</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Notes</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length ? (
              entries.map((e) => (
                <tr key={e._id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 text-muted">{new Date(e.tradeDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-mono font-semibold">{e.symbol}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${e.type === 'BUY' ? 'bg-mint/15 text-mint' : 'bg-coral/15 text-coral'}`}>
                      {e.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{e.quantity}</td>
                  <td className="px-4 py-3 text-right font-mono">${e.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono">${e.total.toFixed(2)}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted truncate max-w-[200px]">{e.notes}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="btn btn-ghost !px-3 !py-1 text-xs text-coral" onClick={() => removeEntry(e)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted">
                  No trades logged yet. Add one above to start your journal.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
