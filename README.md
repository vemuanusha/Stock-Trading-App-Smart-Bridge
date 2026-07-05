# StockTrade — Stock Trading Simulation Platform

A full-stack MERN (MongoDB, Express, React, Node) app for practicing stock trading
with virtual funds. Includes JWT auth with user/admin roles, buy/sell simulation,
portfolio tracking, a watchlist, transaction history, and an admin panel for
managing stocks and users.

## Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
- **Frontend:** React (Vite), Redux Toolkit, React Router, Axios, Chart.js, Tailwind CSS

## Project structure

```
stock-trading-simulator/
├── backend/
│   ├── config/db.js            MongoDB connection
│   ├── models/                 User, Stock, Portfolio, Transaction, Watchlist
│   ├── middleware/              JWT auth, role checks, error handling
│   ├── controllers/             Business logic for each module
│   ├── routes/                  Express route definitions
│   ├── utils/                   Token helper + database seed script
│   └── server.js                App entry point
└── frontend/
    └── src/
        ├── api/axios.js         Configured Axios instance (attaches JWT)
        ├── redux/                Redux Toolkit store + auth/portfolio slices
        ├── components/           Navbar, StockTable, TradeModal, charts, guards
        └── pages/                Login, Register, Dashboard, Markets, Portfolio, Watchlist, History, Admin
```

## 1. Prerequisites

- Node.js v16+ and npm
- A MongoDB instance — either:
  - Local: install MongoDB Community Server and run `mongod`, or
  - Free cloud instance: [MongoDB Atlas](https://www.mongodb.com/atlas)

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env     # edit MONGO_URI / JWT_SECRET if needed
npm run seed              # loads 12 starter stocks + creates a default admin
npm run dev                # starts the API on http://localhost:5000
```

The seed script also creates a default admin account:
- **Email:** admin@stocksim.com
- **Password:** admin123

### Environment variables (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/stock_sim` |
| `DB_NAME` | Database name the app always connects to, regardless of any path in `MONGO_URI` | `stock_sim` |
| `JWT_SECRET` | Secret used to sign JWTs — change this | — |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `PORT` | API port | `5000` |
| `CLIENT_URL` | Frontend origin, used for CORS | `http://localhost:5173` |
| `STARTING_BALANCE` | Virtual cash given to new users | `100000` |

### Troubleshooting

**`E11000 duplicate key error ... username_1 dup key: { username: null }`**
This app's schema has no `username` field at all — this error means the
database you connected to (often the default `test` database on a shared
Atlas cluster) already has leftover data/indexes from a different project.
The app always forces a dedicated database via `DB_NAME` (default
`stock_sim`), so a fresh run should avoid this automatically. If you still
see it, set `DB_NAME` in `.env` to something unique, or drop the offending
index/collection in Atlas/Compass.

**`Error: listen EADDRINUSE: address already in use :::5000`**
Something else on your machine is already using port 5000. Either stop that
process, or set a different `PORT` in `backend/.env`. To find what's using
the port:
- Windows: `netstat -ano | findstr :5000` then `taskkill /PID <pid> /F`
- macOS/Linux: `lsof -i :5000` then `kill -9 <pid>`

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev                # starts the app on http://localhost:5173
```

Vite is configured to proxy `/api` requests to `http://localhost:5000`, so no
extra configuration is needed in development. For production, build with
`npm run build` and serve the `dist/` folder from any static host (or from
Express — see note below).

## 4. Using the app

1. Register a new account (starts with $100,000 virtual cash) or log in as the
   seeded admin.
2. **Markets** — search stocks, view a price trend, buy or sell shares.
3. **Portfolio** — see live holdings, average cost, market value, and P/L; sell
   directly from here.
4. **Watchlist** — star stocks to track them without holding a position.
5. **History** — full log of every buy/sell transaction.
6. **Admin** (admin role only) — add/edit/delete stocks, simulate a random
   market price tick, promote/demote user roles, and view recent platform
   activity.

## 5. API overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Log in, get JWT |
| GET | `/api/auth/me` | Private | Current user profile |
| GET | `/api/stocks` | Public | List/search stocks |
| GET | `/api/stocks/:idOrSymbol` | Public | Single stock |
| POST | `/api/stocks` | Admin | Create stock |
| PUT | `/api/stocks/:id` | Admin | Update stock (price, name, sector...) |
| DELETE | `/api/stocks/:id` | Admin | Remove stock |
| POST | `/api/stocks/simulate-tick` | Admin | Randomly move all prices |
| POST | `/api/trade/buy` | Private | Buy shares |
| POST | `/api/trade/sell` | Private | Sell shares |
| GET | `/api/trade/history` | Private | Your transaction history |
| GET | `/api/portfolio` | Private | Your live holdings + valuation |
| GET | `/api/watchlist` | Private | Your watchlist |
| POST | `/api/watchlist/:stockId` | Private | Add to watchlist |
| DELETE | `/api/watchlist/:stockId` | Private | Remove from watchlist |
| GET | `/api/admin/users` | Admin | List all users |
| PUT | `/api/admin/users/:id` | Admin | Update a user's role/balance |
| GET | `/api/admin/stats` | Admin | Platform stats + recent activity |

All protected routes require an `Authorization: Bearer <token>` header. The
frontend's Axios instance attaches this automatically once you're logged in.

## 6. Notes on data & security

- Passwords are hashed with bcrypt before being stored; the password field is
  never returned by the API (`select: false` on the schema, explicit `.select('+password')` only during login).
  Buy/sell math is done server-side against the live stock price, not values sent
  from the client, so the balance can't be manipulated from the browser.
- JWTs carry the user id and role; `middleware/auth.js` verifies the token and
  `authorize('admin')` restricts admin-only routes.
- This is a learning/demo project: trading uses simulated prices you (or the
  admin panel's "Simulate market tick") control — it is **not** connected to
  real market data or real brokerage accounts.

## 7. Optional: serving the frontend from Express

For a single-deployment setup, after `npm run build` in `frontend/`, you can
copy `frontend/dist` into the backend and add to `server.js`:

```js
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
```

placed after the API routes. Otherwise, simply run backend and frontend as two
separate processes (as shown above) — this is the recommended setup for
development.

Frontend:
(https://stock-trading-app-smart-bridge.vercel.app/)

Backend:
(https://stock-trading-app-smart-bridge.onrender.com)
