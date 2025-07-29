import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';
import Swal from 'sweetalert2';
import Toast from '../../services/toast';

/* -------------------- 1. Fetch All Customers -------------------- */
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

/* -------------------- 2. Fetch Single Customer -------------------- */
export const fetchCustomerById = createAsyncThunk(
  'customer/fetchCustomerById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/customer/${id}`);
      console.log("res", res)
      return res.data.customer;
    } catch (err) {
      console.error("error", err)
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch customer');
    }
  }
);

/* -------------------- 3. Update Customer -------------------- */
export const updateCustomer = createAsyncThunk(
  'customer/updateCustomer',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/customer/${id}`, formData);
      Toast.success(res.data.message || 'Customer updated');
      return res.data;
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Update failed');
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

/* -------------------- 4. Deactivate Customer (Soft Delete) -------------------- */
export const deactivateCustomer = createAsyncThunk(
  'customer/deactivateCustomer',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/customer/deactivate/${id}`);
      Toast.success(res.data.message || 'Customer deactivated');
      console.log("deactivateCustomer", res)
      return id;
    } catch (err) {
      console.error("deactivateCustomer", err)
      Toast.error(err.response?.data?.message || 'Deactivation failed');
      return rejectWithValue(err.response?.data?.message || 'Deactivation failed');
    }
  }
);

/* -------------------- 6. Activate Customer -------------------- */
export const activateCustomer = createAsyncThunk(
  'customer/activateCustomer',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/customer/activate/${id}`);
      Toast.success(res.data.message || 'Customer activated');
      console.log("activateCustomer", res)
      return id;
    } catch (err) {
      console.error("activateCustomer", err)
      Toast.error(err.response?.data?.message || 'Activation failed');
      return rejectWithValue(err.response?.data?.message || 'Activation failed');
    }
  }
);

/* -------------------- 5. Delete Customer Permanently (Hard Delete with Confirmation) -------------------- */
export const deleteCustomerPermanently = createAsyncThunk(
  'customer/deleteCustomerPermanently',
  async (id, { rejectWithValue }) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This customer will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirm.isConfirmed) {
      return rejectWithValue('Deletion cancelled');
    }

    try {
      const res = await axiosInstance.delete(`/customer/${id}`);
      Toast.success(res.data.message || 'Customer permanently deleted');
      return id;
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Permanent delete failed');
      return rejectWithValue(err.response?.data?.message || 'Permanent delete failed');
    }
  }
);


/* -------------------- 7. Change Password -------------------- */
export const changePassword = createAsyncThunk(
  'customer/changePassword',
  async ({ current_password, new_password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put('/auth/change-password', {
        current_password,
        new_password,
      });
      Toast.success(res.data.message || 'Password changed successfully');
      return res.data;
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Change password failed');
      return rejectWithValue(err.response?.data?.message || 'Change password failed');
    }
  }
);

/* -------------------- Slice -------------------- */
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

      // Fetch All
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

      // Fetch One
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

      // Update
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

      // Soft Delete
      .addCase(deactivateCustomer.fulfilled, (state, action) => {
        state.all = state.all.map((cust) =>
          cust.id === action.payload ? { ...cust, is_active: false } : cust
        );
      })

      // Hard Delete
      .addCase(deleteCustomerPermanently.fulfilled, (state, action) => {
        state.all = state.all.filter((cust) => cust.id !== action.payload);
      })

      // Activate
      .addCase(activateCustomer.fulfilled, (state, action) => {
        state.all = state.all.map((cust) =>
          cust.id === action.payload ? { ...cust, is_active: true } : cust
        );
      })

      // Change Password
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


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '../../lib/axiosInstance';
// import Swal from 'sweetalert2';
// import Toast from '../../services/toast';

// /* -------------------- 1. Fetch All Customers -------------------- */
// export const fetchAllCustomers = createAsyncThunk(
//   'customer/fetchAllCustomers',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get('/customer');
//       return res.data.customers;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || 'Failed to fetch customers');
//     }
//   }
// );

// /* -------------------- 2. Fetch Single Customer -------------------- */
// export const fetchCustomerById = createAsyncThunk(
//   'customer/fetchCustomerById',
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get(`/customer/${id}`);
//       return res.data.customer;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || 'Failed to fetch customer');
//     }
//   }
// );

// /* -------------------- 3. Update Customer -------------------- */
// export const updateCustomer = createAsyncThunk(
//   'customer/updateCustomer',
//   async ({ id, formData }, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.put(`/customer/${id}`, formData);
//       Toast.success(res.data.message || 'Customer updated');
//       return res.data;
//     } catch (err) {
//       Toast.error(err.response?.data?.message || 'Update failed');
//       return rejectWithValue(err.response?.data?.message || 'Update failed');
//     }
//   }
// );

// /* -------------------- 4. Deactivate Customer (Soft Delete) -------------------- */
// export const deactivateCustomer = createAsyncThunk(
//   'customer/deactivateCustomer',
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.put(`/customer/deactivate/${id}`);
//       Toast.success(res.data.message || 'Customer deactivated');
//       return id;
//     } catch (err) {
//       Toast.error(err.response?.data?.message || 'Deactivation failed');
//       return rejectWithValue(err.response?.data?.message || 'Deactivation failed');
//     }
//   }
// );

// /* -------------------- 5. Delete Customer Permanently (Hard Delete) -------------------- */
// export const deleteCustomerPermanently = createAsyncThunk(
//   'customer/deleteCustomerPermanently',
//   async (id, { rejectWithValue }) => {
//     const confirm = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'This customer will be permanently deleted!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, delete it!',
//     });

//     if (!confirm.isConfirmed) {
//       return rejectWithValue('Deletion cancelled');
//     }

//     try {
//       const res = await axiosInstance.delete(`/customer/${id}`);
//       Toast.success(res.data.message || 'Customer permanently deleted');
//       return id;
//     } catch (err) {
//       Toast.error(err.response?.data?.message || 'Permanent delete failed');
//       return rejectWithValue(err.response?.data?.message || 'Permanent delete failed');
//     }
//   }
// );

// /* -------------------- 6. Activate Customer -------------------- */
// export const activateCustomer = createAsyncThunk(
//   'customer/activateCustomer',
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.put(`/customer/activate/${id}`);
//       Toast.success(res.data.message || 'Customer activated');
//       return id;
//     } catch (err) {
//       Toast.error(err.response?.data?.message || 'Activation failed');
//       return rejectWithValue(err.response?.data?.message || 'Activation failed');
//     }
//   }
// );

// /* -------------------- 7. Change Password -------------------- */
// export const changePassword = createAsyncThunk(
//   'customer/changePassword',
//   async ({ current_password, new_password }, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.put('/auth/change-password', {
//         current_password,
//         new_password,
//       });
//       Toast.success(res.data.message || 'Password changed successfully');
//       return res.data;
//     } catch (err) {
//       Toast.error(err.response?.data?.message || 'Change password failed');
//       return rejectWithValue(err.response?.data?.message || 'Change password failed');
//     }
//   }
// );

// /* -------------------- Slice -------------------- */
// const customerSlice = createSlice({
//   name: 'customer',
//   initialState: {
//     data: null,
//     all: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearCustomerState: (state) => {
//       state.data = null;
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch All
//       .addCase(fetchAllCustomers.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchAllCustomers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.all = action.payload;
//       })
//       .addCase(fetchAllCustomers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch One
//       .addCase(fetchCustomerById.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchCustomerById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(fetchCustomerById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Update
//       .addCase(updateCustomer.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updateCustomer.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(updateCustomer.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Soft Delete
//       .addCase(deactivateCustomer.fulfilled, (state, action) => {
//         state.all = state.all.map((cust) =>
//           cust.id === action.payload ? { ...cust, is_active: false } : cust
//         );
//       })

//       // Hard Delete
//       .addCase(deleteCustomerPermanently.fulfilled, (state, action) => {
//         state.all = state.all.filter((cust) => cust.id !== action.payload);
//       })

//       // Activate
//       .addCase(activateCustomer.fulfilled, (state, action) => {
//         state.all = state.all.map((cust) =>
//           cust.id === action.payload ? { ...cust, is_active: true } : cust
//         );
//       })

//       // Change Password
//       .addCase(changePassword.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(changePassword.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(changePassword.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearCustomerState } = customerSlice.actions;
// export default customerSlice.reducer;