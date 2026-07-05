import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import StockTable from '../components/StockTable';
import TradeModal from '../components/TradeModal';

export default function Watchlist() {
  const [stocks, setStocks] = useState([]);
  const [tradeStock, setTradeStock] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/watchlist');
      setStocks(data);
    } catch (err) {
      toast.error('Failed to load watchlist');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (stock) => {
    try {
      await api.delete(`/watchlist/${stock._id}`);
      toast.info(`Removed ${stock.symbol} from watchlist`);
      load();
    } catch (err) {
      toast.error('Could not remove from watchlist');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Watchlist</h1>
        <p className="text-muted text-sm mt-1">Stocks you're keeping an eye on.</p>
      </div>

      <StockTable
        stocks={stocks}
        watchedSymbols={stocks.map((s) => s.symbol)}
        onWatch={remove}
        onTrade={(s) => setTradeStock(s)}
      />

      <TradeModal stock={tradeStock} onClose={() => setTradeStock(null)} onTraded={load} />
    </div>
  );
}
