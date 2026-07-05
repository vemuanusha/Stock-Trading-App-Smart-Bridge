import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function History() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get('/trade/history').then((res) => setTransactions(res.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Transaction history</h1>
        <p className="text-muted text-sm mt-1">Every buy and sell you've made in the simulator.</p>
      </div>

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
            </tr>
          </thead>
          <tbody>
            {transactions.length ? (
              transactions.map((t) => (
                <tr key={t._id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 text-muted">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono font-semibold">{t.symbol}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${t.type === 'BUY' ? 'bg-mint/15 text-mint' : 'bg-coral/15 text-coral'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{t.quantity}</td>
                  <td className="px-4 py-3 text-right font-mono">${t.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono">${t.total.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">No transactions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
