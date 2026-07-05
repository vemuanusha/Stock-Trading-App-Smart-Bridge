import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axios';
import { fetchPortfolio } from '../redux/slices/portfolioSlice';
import TradeModal from '../components/TradeModal';

export default function Portfolio() {
  const dispatch = useDispatch();
  const portfolio = useSelector((state) => state.portfolio);
  const [tradeStock, setTradeStock] = useState(null);

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  const openSell = async (holding) => {
    // Need the full stock object (with _id) to trade; fetch it by symbol.
    try {
      const { data } = await api.get(`/stocks/${holding.symbol}`);
      setTradeStock(data);
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Your portfolio</h1>
        <p className="text-muted text-sm mt-1">Live valuation of everything you currently hold.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="text-xs text-muted mb-1">Cash</p>
          <p className="font-mono text-xl text-gold">${portfolio.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-muted mb-1">Holdings value</p>
          <p className="font-mono text-xl">${portfolio.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-muted mb-1">Net worth</p>
          <p className="font-mono text-xl">${portfolio.netWorth?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-muted mb-1">Total P/L</p>
          <p className={`font-mono text-xl ${portfolio.totalPL >= 0 ? 'text-mint' : 'text-coral'}`}>
            {portfolio.totalPL >= 0 ? '+' : ''}${portfolio.totalPL?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3 font-medium">Symbol</th>
              <th className="px-4 py-3 font-medium text-right">Qty</th>
              <th className="px-4 py-3 font-medium text-right">Avg. cost</th>
              <th className="px-4 py-3 font-medium text-right">Current</th>
              <th className="px-4 py-3 font-medium text-right">Market value</th>
              <th className="px-4 py-3 font-medium text-right">P/L</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.holdings?.length ? (
              portfolio.holdings.map((h) => (
                <tr key={h.symbol} className="border-b border-border/60 last:border-0 hover:bg-surface2/50">
                  <td className="px-4 py-3 font-mono font-semibold">{h.symbol}</td>
                  <td className="px-4 py-3 text-right font-mono">{h.quantity}</td>
                  <td className="px-4 py-3 text-right font-mono">${h.averageBuyPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono">${h.currentPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono">${h.marketValue.toFixed(2)}</td>
                  <td className={`px-4 py-3 text-right font-mono ${h.profitLoss >= 0 ? 'text-mint' : 'text-coral'}`}>
                    {h.profitLoss >= 0 ? '+' : ''}${h.profitLoss.toFixed(2)} ({h.profitLossPercent}%)
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="btn btn-sell !px-3 !py-1 text-xs" onClick={() => openSell(h)}>Sell</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  You don't own any shares yet. Head to Markets to make your first trade.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TradeModal
        stock={tradeStock}
        onClose={() => setTradeStock(null)}
        onTraded={() => dispatch(fetchPortfolio())}
      />
    </div>
  );
}
