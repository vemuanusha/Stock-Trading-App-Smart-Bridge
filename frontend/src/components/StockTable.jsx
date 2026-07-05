export default function StockTable({ stocks, onTrade, onWatch, watchedSymbols = [] }) {
  if (!stocks || stocks.length === 0) {
    return (
      <div className="card p-8 text-center text-muted">
        No stocks match your search. Try a different symbol or name.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted">
            <th className="px-4 py-3 font-medium">Symbol</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Name</th>
            <th className="px-4 py-3 font-medium hidden lg:table-cell">Sector</th>
            <th className="px-4 py-3 font-medium text-right">Price</th>
            <th className="px-4 py-3 font-medium text-right">Change</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => {
            const up = (s.changePercent || 0) >= 0;
            const isWatched = watchedSymbols.includes(s.symbol);
            return (
              <tr key={s._id} className="border-b border-border/60 last:border-0 hover:bg-surface2/50">
                <td className="px-4 py-3 font-mono font-semibold text-text">{s.symbol}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted">{s.name}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted">{s.sector}</td>
                <td className="px-4 py-3 text-right font-mono">${s.price?.toFixed(2)}</td>
                <td className={`px-4 py-3 text-right font-mono ${up ? 'text-mint' : 'text-coral'}`}>
                  {up ? '+' : ''}{(s.changePercent || 0).toFixed(2)}%
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {onWatch && (
                      <button
                        onClick={() => onWatch(s)}
                        className="btn btn-ghost !px-2 !py-1 text-xs"
                        title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        {isWatched ? '★' : '☆'}
                      </button>
                    )}
                    {onTrade && (
                      <button
                        onClick={() => onTrade(s)}
                        className="btn btn-buy !px-3 !py-1 text-xs"
                      >
                        Trade
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
