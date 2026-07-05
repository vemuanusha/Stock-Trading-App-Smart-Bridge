import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <p className="font-mono text-mint text-sm mb-4 tracking-widest">PRACTICE TRADING, ZERO RISK</p>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight mb-6">
        Learn to trade with <span className="text-mint">$100,000</span> in virtual cash
      </h1>
      <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
        StockTrade is a full-stack stock trading simulator. Buy and sell simulated shares,
        track your portfolio in real time, and build market intuition without risking real money.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/register" className="btn btn-buy !px-6 !py-3">Create free account</Link>
        <Link to="/login" className="btn btn-ghost !px-6 !py-3">Log in</Link>
      </div>
    </div>
  );
}
