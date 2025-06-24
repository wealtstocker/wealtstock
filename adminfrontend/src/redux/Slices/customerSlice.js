// src/redux/slices/customerSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';
import Toast from '../../services/toast';

// ✅ 1. Fetch all customers
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

// ✅ 2. Fetch single customer by ID
export const fetchCustomerById = createAsyncThunk(
  'customer/fetchCustomerById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/customer/${id}`);
      return res.data.customer;
    } catch (err) {
      console.error(err)
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch customer');
    }
  }
);

// ✅ 3. Update customer
export const updateCustomer = createAsyncThunk(
  'customer/updateCustomer',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/customer/${id}`, formData);
       console.log("update",res)
      Toast.success(res.data.message || 'Customer updated');
      return res.data;
    } catch (err) {
       console.error("error update",err)
      Toast.error(err.response?.data?.message || 'Update failed');
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

// ✅ 4. Delete (Deactivate) customer
export const deleteCustomer = createAsyncThunk(
  'customer/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/customer/${id}`);
      Toast.success(res.data.message || 'Customer deactivated');
       console.log("delted",res)
      return id;
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Delete failed');
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

// ✅ 5. Activate customer
export const activateCustomer = createAsyncThunk(
  'customer/activateCustomer',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/customer/activate/${id}`);
      console.log("activate",res)
      Toast.success(res.data.message || 'Customer activated');
      return id;
    } catch (err) {
       console.error("activate error",err)
      Toast.error(err.response?.data?.message || 'Activation failed');
      return rejectWithValue(err.response?.data?.message || 'Activation failed');
    }
  }
);

// ✅ 6. Change password (logged-in customer)
export const changePassword = createAsyncThunk(
  'customer/changePassword',
  async ({ current_password, new_password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put('/auth/change-password', {
        current_password,
        new_password,
      });
      Toast.success(res.data.message || 'Password changed successfully');
       console.log("change password",res)
      return res.data;
    } catch (err) {
       console.error("error change",err)
      Toast.error(err.response?.data?.message || 'Change password failed');
      return rejectWithValue(err.response?.data?.message || 'Change password failed');
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
  reducers: {
    clearCustomerState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ✅ All customers
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

      // ✅ Single customer
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

      // ✅ Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Delete customer
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.all = state.all.map((cust) =>
          cust.id === action.payload ? { ...cust, is_active: false } : cust
        );
      })

      // ✅ Activate customer
      .addCase(activateCustomer.fulfilled, (state, action) => {
        state.all = state.all.map((cust) =>
          cust.id === action.payload ? { ...cust, is_active: true } : cust
        );
      })

      // ✅ Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCustomerState } = customerSlice.actions;
export default customerSlice.reducer;
