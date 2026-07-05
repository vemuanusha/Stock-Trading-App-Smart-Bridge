import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import StockTable from '../components/StockTable';
import TradeModal from '../components/TradeModal';
import PriceChart from '../components/PriceChart';

export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeStock, setTradeStock] = useState(null);
  const [watchedSymbols, setWatchedSymbols] = useState([]);

  const loadStocks = useCallback(async () => {
    try {
      const { data } = await api.get('/stocks', { params: search ? { search } : {} });
      setStocks(data);
    } catch (err) {
      toast.error('Failed to load stocks');
    }
  }, [search]);

  const loadWatchlist = useCallback(async () => {
    try {
      const { data } = await api.get('/watchlist');
      setWatchedSymbols(data.map((s) => s.symbol));
    } catch (err) {
      // Not fatal, just skip watchlist highlighting
    }
  }, []);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const toggleWatch = async (stock) => {
    try {
      if (watchedSymbols.includes(stock.symbol)) {
        await api.delete(`/watchlist/${stock._id}`);
        toast.info(`Removed ${stock.symbol} from watchlist`);
      } else {
        await api.post(`/watchlist/${stock._id}`);
        toast.success(`Added ${stock.symbol} to watchlist`);
      }
      loadWatchlist();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Watchlist update failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Markets</h1>
          <p className="text-muted text-sm mt-1">Search and trade from the full stock listing.</p>
        </div>
        <input
          className="input sm:w-72"
          placeholder="Search by symbol or company name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {selectedStock && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-display font-semibold text-lg">{selectedStock.symbol} <span className="text-muted font-body text-sm">— {selectedStock.name}</span></h2>
            </div>
            <button className="btn btn-buy !py-1.5" onClick={() => setTradeStock(selectedStock)}>Trade</button>
          </div>
          <PriceChart stock={selectedStock} />
        </div>
      )}

      <StockTable
        stocks={stocks}
        watchedSymbols={watchedSymbols}
        onWatch={toggleWatch}
        onTrade={(s) => { setSelectedStock(s); setTradeStock(s); }}
      />

      <TradeModal
        stock={tradeStock}
        onClose={() => setTradeStock(null)}
        onTraded={loadStocks}
      />
    </div>
  );
}
