import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../lib/axiosInstance';
import axiosInstance from '../../lib/axiosInstance';

// ✅ Fetch site config (assuming only one config)
export const fetchSiteConfig = createAsyncThunk(
  'siteConfig/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/site-config');

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Fetch failed');
    }
  }
);

// ✅ Create site config (multipart/form-data)
export const createSiteConfig = createAsyncThunk(
  'siteConfig/create',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/site-config', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("---rrr",res)
      return res.data;
    } catch (error) {
        console.log(error)
      return rejectWithValue(error.response?.data?.message || 'Create failed');
    }
  }
);

// ✅ Update site config
export const updateSiteConfig = createAsyncThunk(
  'siteConfig/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/site-config/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("---rrr",res)
      return res.data;
    } catch (error) {
        console.error(error)
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

// ✅ Delete site config
export const deleteSiteConfig = createAsyncThunk(
  'siteConfig/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/site-config/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  }
);

const siteConfigSlice = createSlice({
  name: 'siteConfig',
  initialState: {
    config: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSiteConfig: (state) => {
      state.config = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔄 FETCH
      .addCase(fetchSiteConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(fetchSiteConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ CREATE
      .addCase(createSiteConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSiteConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(createSiteConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✏️ UPDATE
      .addCase(updateSiteConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSiteConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(updateSiteConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ❌ DELETE
      .addCase(deleteSiteConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSiteConfig.fulfilled, (state) => {
        state.loading = false;
        state.config = null;
      })
      .addCase(deleteSiteConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSiteConfig } = siteConfigSlice.actions;
export default siteConfigSlice.reducer;
