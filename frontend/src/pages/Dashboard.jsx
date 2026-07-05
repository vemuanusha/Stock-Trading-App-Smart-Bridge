import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import TickerTape from '../components/TickerTape';
import { fetchPortfolio } from '../redux/slices/portfolioSlice';

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const portfolio = useSelector((state) => state.portfolio);
  const dispatch = useDispatch();

  useEffect(() => {
    api.get('/stocks').then((res) => setStocks(res.data)).catch(() => {});
    dispatch(fetchPortfolio());
  }, [dispatch]);

  const gainers = [...stocks].sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0)).slice(0, 5);
  const losers = [...stocks].sort((a, b) => (a.changePercent || 0) - (b.changePercent || 0)).slice(0, 5);

  return (
    <div>
      <TickerTape stocks={stocks} />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="font-display text-2xl font-semibold">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-muted text-sm mt-1">Here's how your simulated portfolio is doing today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-xs text-muted mb-1">Cash balance</p>
            <p className="font-mono text-2xl text-gold">${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs text-muted mb-1">Holdings value</p>
            <p className="font-mono text-2xl">${portfolio.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs text-muted mb-1">Total profit / loss</p>
            <p className={`font-mono text-2xl ${portfolio.totalPL >= 0 ? 'text-mint' : 'text-coral'}`}>
              {portfolio.totalPL >= 0 ? '+' : ''}${portfolio.totalPL?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold">Top gainers</h2>
              <Link to="/stocks" className="text-xs text-mint hover:underline">View all markets</Link>
            </div>
            <ul className="space-y-2">
              {gainers.map((s) => (
                <li key={s._id} className="flex justify-between text-sm border-b border-border/60 pb-2 last:border-0">
                  <span className="font-mono">{s.symbol}</span>
                  <span className="text-mint font-mono">+{(s.changePercent || 0).toFixed(2)}%</span>
                </li>
              ))}
              {gainers.length === 0 && <li className="text-muted text-sm">No data yet — try seeding stocks.</li>}
            </ul>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold">Top losers</h2>
              <Link to="/stocks" className="text-xs text-mint hover:underline">View all markets</Link>
            </div>
            <ul className="space-y-2">
              {losers.map((s) => (
                <li key={s._id} className="flex justify-between text-sm border-b border-border/60 pb-2 last:border-0">
                  <span className="font-mono">{s.symbol}</span>
                  <span className="text-coral font-mono">{(s.changePercent || 0).toFixed(2)}%</span>
                </li>
              ))}
              {losers.length === 0 && <li className="text-muted text-sm">No data yet — try seeding stocks.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
