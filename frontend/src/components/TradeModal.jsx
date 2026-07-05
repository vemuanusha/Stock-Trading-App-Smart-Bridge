import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { updateBalance } from '../redux/slices/authSlice';

export default function TradeModal({ stock, onClose, onTraded }) {
  const [side, setSide] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!stock) return null;

  const estTotal = (Number(quantity) || 0) * stock.price;

  const submit = async (e) => {
    e.preventDefault();
    if (!quantity || quantity <= 0) {
      toast.error('Enter a valid quantity');
      return;
    }
    setLoading(true);
    try {
      const endpoint = side === 'BUY' ? '/trade/buy' : '/trade/sell';
      const { data } = await api.post(endpoint, { stockId: stock._id, quantity: Number(quantity) });
      dispatch(updateBalance(data.balance));
      toast.success(data.message);
      onTraded && onTraded();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="card w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold">{stock.symbol}</h3>
            <p className="text-muted text-sm">{stock.name}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text text-xl leading-none">&times;</button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setSide('BUY')}
            className={`flex-1 btn ${side === 'BUY' ? 'btn-buy' : 'btn-ghost'}`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setSide('SELL')}
            className={`flex-1 btn ${side === 'SELL' ? 'btn-sell' : 'btn-ghost'}`}
          >
            Sell
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-muted block mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              step="1"
              className="input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="flex justify-between text-sm py-2 border-t border-border">
            <span className="text-muted">Market price</span>
            <span className="font-mono">${stock.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Estimated total</span>
            <span className="font-mono font-semibold">${estTotal.toFixed(2)}</span>
          </div>
          {user && (
            <div className="flex justify-between text-xs">
              <span className="text-muted">Available balance</span>
              <span className="font-mono text-gold">${user.balance?.toFixed(2)}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn w-full mt-2 ${side === 'BUY' ? 'btn-buy' : 'btn-sell'}`}
          >
            {loading ? 'Processing…' : `${side === 'BUY' ? 'Buy' : 'Sell'} ${quantity || 0} share(s)`}
          </button>
        </form>
      </div>
    </div>
  );
}
