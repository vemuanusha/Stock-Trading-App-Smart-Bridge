export default function TickerTape({ stocks }) {
  if (!stocks || stocks.length === 0) return null;
  const doubled = [...stocks, ...stocks];

  return (
    <div className="overflow-hidden border-y border-border bg-surface/60 py-2">
      <div className="flex w-max gap-8 ticker-track whitespace-nowrap">
        {doubled.map((s, i) => {
          const up = s.changePercent >= 0;
          return (
            <span key={`${s.symbol}-${i}`} className="font-mono text-sm flex items-center gap-2">
              <span className="text-muted">{s.symbol}</span>
              <span className="text-text">${s.price?.toFixed(2)}</span>
              <span className={up ? 'text-mint' : 'text-coral'}>
                {up ? '▲' : '▼'} {Math.abs(s.changePercent || 0).toFixed(2)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
