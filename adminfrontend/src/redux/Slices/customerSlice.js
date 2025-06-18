// src/redux/slices/customerSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';
import Toast from '../../services/toast';


// ✅ Fetch all customers
// customerSlice.js
export const fetchAllCustomers = createAsyncThunk(
  'customer/fetchAllCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/customer');
      return res.data.customers;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch customers');
    }
  }
);


// ✅ Fetch customer by ID
export const fetchCustomerById = createAsyncThunk(
  'customer/fetchCustomerById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/customer/${id}`);
      return res.data.customer;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch customer');
    }
  }
);

// ✅ Update customer
export const updateCustomer = createAsyncThunk(
  'customer/updateCustomer',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/customer/${id}`, formData);
      Toast.success(res.data.message || 'Profile updated successfully');
      console.log(res)
      return res.data;
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Profile update failed');
      console.error(err)
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    data: null,
    all: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
