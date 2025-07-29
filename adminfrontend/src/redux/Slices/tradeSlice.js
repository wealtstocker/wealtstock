import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';
import { toast } from 'react-toastify';

export const fetchAllTrades = createAsyncThunk('trade/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/trade');
    return res.data.trades;
  } catch (err) {
    toast.error('Failed to fetch trades');
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchMyTrades = createAsyncThunk('trade/fetchMy', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/trade/my');
    return res.data.trades;
  } catch (err) {
    toast.error('Failed to fetch my trades');
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchCompletedTrades = createAsyncThunk('trade/fetchCompleted', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/trade?status=approved');
    return res.data.trades;
  } catch (err) {
    toast.error('Failed to fetch completed trades');
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchPendingTrades = createAsyncThunk('trade/fetchPending', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/trade');
    console.log("res", res)
    return res.data.trades;
  } catch (err) {
    toast.error('Failed to fetch pending trades');
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchApprovedTrades = createAsyncThunk('trade/fetchApproved', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/trade?status=approved');
    return res.data.trades;
  } catch (err) {
    toast.error('Failed to fetch approved trades');
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchSingleTrade = createAsyncThunk('trade/fetchOne', async (id, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/trade/${id}`);
    return res.data.trade;
  } catch (err) {
    toast.error('Failed to fetch trade');
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const createTrade = createAsyncThunk('trade/create', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/trade', data.tradeData);
    toast.success(res.data?.message || 'Trade created successfully');
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Trade creation failed');
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const updateTrade = createAsyncThunk('trade/update', async ({ id, tradeData, navigate }, thunkAPI) => {
  try {
    console.log('Updating trade:', { id, tradeData });
    if (!tradeData.exit_price || !tradeData.exit_quantity) {
      console.warn('Exit price or quantity missing, update may not reflect profit/loss accurately');
    }
    const res = await axiosInstance.put(`/trade/${id}`, tradeData);
    toast.success('Trade updated successfully');
    if (navigate) navigate('/admin/trades');
    return { id, ...res.data };
  } catch (err) {
    toast.error('Trade update failed');
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const approveTrade = createAsyncThunk('trade/approve', async (id, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/trade/approve/${id}`);
    toast.success('Trade approved');
    return id;
  } catch (err) {
    toast.error('Trade approval failed');
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const deactivateTrade = createAsyncThunk('trade/deactivate', async (id, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/trade/deactivate/${id}`);
    toast.success('Trade deactivated');
    return id;
  } catch (err) {
    toast.error('Trade deactivation failed');
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    all: [],
    myTrades: [],
    completedTrades: [],
    pendingTrades: [],
    approvedTrades: [],
    single: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTrades.pending, (state) => { state.loading = true; })
      .addCase(fetchAllTrades.fulfilled, (state, action) => { state.loading = false; state.all = action.payload; })
      .addCase(fetchAllTrades.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyTrades.fulfilled, (state, action) => { state.myTrades = action.payload; })
      .addCase(fetchCompletedTrades.fulfilled, (state, action) => { state.completedTrades = action.payload; })
      .addCase(fetchPendingTrades.fulfilled, (state, action) => { state.pendingTrades = action.payload; })
      .addCase(fetchApprovedTrades.fulfilled, (state, action) => { state.approvedTrades = action.payload; })
      .addCase(fetchSingleTrade.fulfilled, (state, action) => { state.single = action.payload; })
      .addCase(createTrade.fulfilled, (state, action) => { state.all.unshift(action.payload.trade); })
      .addCase(updateTrade.fulfilled, (state, action) => {
        const index = state.all.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.all[index] = { ...state.all[index], ...action.payload };
      })
      .addCase(approveTrade.fulfilled, (state, action) => {
        const index = state.all.findIndex((t) => t.id === action.payload);
        if (index !== -1) state.all[index].status = 'approved';
      })
      .addCase(deactivateTrade.fulfilled, (state, action) => {
        const index = state.all.findIndex((t) => t.id === action.payload);
        if (index !== -1) state.all[index].status = 'deactivated';
      });
  },
});

export default tradeSlice.reducer;