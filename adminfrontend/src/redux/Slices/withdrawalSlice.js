// src/redux/Slices/withdrawalSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";

export const getAllWithdrawalsAPI = (status = "") =>
  axiosInstance.get(`/wallet/all-withdrawals${status ? `?status=${status}` : ""}`);

export const updateWithdrawalStatusAPI = (payload) =>
  axiosInstance.patch(`/wallet/withdrawal/status`, payload);


export const fetchAllWithdrawals = createAsyncThunk(
  "withdrawals/fetchAll",
  async (status = "", thunkAPI) => {
    try {
      const res = await getAllWithdrawalsAPI(status);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Fetch error");
    }
  }
);


export const updateWithdrawalStatus = createAsyncThunk(
  "withdrawals/updateStatus",
  async ({ withdrawal_id, action }, thunkAPI) => {
    try {
      const res = await updateWithdrawalStatusAPI({ withdrawal_id, action });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Update error");
    }
  }
);

const withdrawalSlice = createSlice({
  name: "withdrawals",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllWithdrawals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWithdrawals.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllWithdrawals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateWithdrawalStatus.fulfilled, (state, action) => {
        const updatedId = action.meta.arg.withdrawal_id;
        state.list = state.list.map((item) =>
          item.id === updatedId ? { ...item, status: action.meta.arg.action === "approve" ? "completed" : "rejected" } : item
        );
      });
  },
});

export default withdrawalSlice.reducer;
