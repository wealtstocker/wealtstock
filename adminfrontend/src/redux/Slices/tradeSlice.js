// src/redux/Slices/tradeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';
import { toast } from 'react-toastify';

export const fetchAllTrades = createAsyncThunk('trade/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/trade');
    return res.data;
  } catch (err) {
    toast.error("Failed to fetch trades");
    console.error("❌ fetchAllTrades error:", err);
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchSingleTrade = createAsyncThunk('trade/fetchOne', async (id, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/trade/${id}`);
    return res.data;
  } catch (err) {
    toast.error("Failed to fetch trade");
    console.error("❌ fetchSingleTrade error:", err);
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const createTrade = createAsyncThunk('trade/create', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/trade', data);
    toast.success(res.data?.message || "Trade created successfully");
    console.log("✅ createTrade response:", res.data);
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Trade creation failed");
    console.error("❌ createTrade error:", err);
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const updateTrade = createAsyncThunk('trade/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/trade/${id}`, data);
    toast.success("Trade updated successfully");
    console.log(res)
    return { id, data };
  } catch (err) {
    toast.error("Trade update failed");
    console.error("❌ updateTrade error:", err);
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const approveTrade = createAsyncThunk('trade/approve', async (id, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/trade/approve/${id}`);
    toast.success("Trade approved");
    return id;
  } catch (err) {
    toast.error("Trade approval failed");
    console.error("❌ approveTrade error:", err);
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
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
        state.error = action.payload;
      })

      .addCase(fetchSingleTrade.fulfilled, (state, action) => {
        state.single = action.payload;
      })

      .addCase(createTrade.fulfilled, (state, action) => {
        state.all.unshift(action.payload.trade); // Store trade info
      })

      .addCase(updateTrade.fulfilled, (state, action) => {
        const index = state.all.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.all[index] = { ...state.all[index], ...action.payload.data };
        }
      })

      .addCase(approveTrade.fulfilled, (state, action) => {
        const index = state.all.findIndex(t => t.id === action.payload);
        if (index !== -1) {
          state.all[index].status = "approved";
        }
      });
  },
});

export default tradeSlice.reducer;
