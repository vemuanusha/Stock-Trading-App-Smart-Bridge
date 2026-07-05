import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchPortfolio = createAsyncThunk('portfolio/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/portfolio');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load portfolio');
  }
});

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    holdings: [],
    totalValue: 0,
    totalInvested: 0,
    totalPL: 0,
    netWorth: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.status = 'succeeded';
        Object.assign(state, action.payload);
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default portfolioSlice.reducer;
