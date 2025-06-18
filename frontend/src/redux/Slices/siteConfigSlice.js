import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';



// ⏬ GET site config
export const fetchSiteConfig = createAsyncThunk(
  'siteConfig/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/site-config");
      console.log(res)
      return res.data;
    } catch (err) {
        console.error(err)
      return rejectWithValue(err.response?.data?.message || 'Failed to load config');
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
  reducers: {},

  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default siteConfigSlice.reducer;
