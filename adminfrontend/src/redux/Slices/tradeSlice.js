// src/features/trade/tradeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';

export const fetchAllTrades = createAsyncThunk('trade/fetchAll', async () => {
  const res = await axiosInstance.get('/trade');
  return res.data;
});

export const fetchSingleTrade = createAsyncThunk('trade/fetchOne', async (id) => {
  const res = await axiosInstance.get(`/trade/${id}`);
  return res.data;
});

export const createTrade = createAsyncThunk('trade/create', async (data) => {
  const res = await axiosInstance.post('/trade', data);
  return res.data;
});

export const updateTrade = createAsyncThunk('trade/update', async ({ id, data }) => {
  const res = await axiosInstance.put(`/trade/${id}`, data);
  return res.data;
});

export const approveTrade = createAsyncThunk('trade/approve', async (id) => {
  const res = await axiosInstance.put(`/trade/approve/${id}`);
  return res.data;
});

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    all: [],
    single: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTrades.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTrades.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllTrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSingleTrade.fulfilled, (state, action) => {
        state.single = action.payload;
      })
      .addCase(createTrade.fulfilled, (state, action) => {
        state.all.unshift(action.payload);
      })
      .addCase(updateTrade.fulfilled, (state, action) => {
        const index = state.all.findIndex(trade => trade.id === action.meta.arg.id);
        if (index !== -1) state.all[index] = { ...state.all[index], ...action.meta.arg.data };
      })
      .addCase(approveTrade.fulfilled, (state, action) => {
        const index = state.all.findIndex(trade => trade.id === action.meta.arg);
        if (index !== -1) state.all[index].status = 'approved';
      });
  },
});

export default tradeSlice.reducer;
