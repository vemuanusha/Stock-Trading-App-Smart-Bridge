import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

// Renders a simple sparkline-style trend from previousClose -> current price.
// (The backend stores current price + previousClose, not full tick history,
// so this gives a lightweight visual trend rather than a full OHLC chart.)
export default function PriceChart({ stock }) {
  if (!stock) return null;
  const up = stock.price >= stock.previousClose;

  const data = {
    labels: ['Prev close', 'Low', 'High', 'Now'],
    datasets: [
      {
        data: [stock.previousClose, stock.dayLow, stock.dayHigh, stock.price],
        borderColor: up ? '#2DD4A7' : '#F2545B',
        backgroundColor: up ? 'rgba(45,212,167,0.15)' : 'rgba(242,84,91,0.15)',
        tension: 0.35,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: up ? '#2DD4A7' : '#F2545B',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8A93A6', font: { family: 'IBM Plex Mono', size: 10 } } },
      y: { grid: { color: '#243352' }, ticks: { color: '#8A93A6', font: { family: 'IBM Plex Mono', size: 10 } } },
    },
  };

  return (
    <div style={{ height: 220 }}>
      <Line data={data} options={options} />
    </div>
  );
}
