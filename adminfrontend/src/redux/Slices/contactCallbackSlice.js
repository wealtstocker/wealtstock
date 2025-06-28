import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';
import Toast from '../../services/toast';


// ===================== Async Thunks ===================== //

// Fetch all contact messages
export const fetchContactMessages = createAsyncThunk(
  'contactCallback/fetchContactMessages',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/contact');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch all callback requests
export const fetchCallbackRequests = createAsyncThunk(
  'contactCallback/fetchCallbackRequests',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/callback');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete a contact message
export const deleteContactMessage = createAsyncThunk(
  'contactCallback/deleteContactMessage',
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/contact/${id}`);
      Toast.success("delted")
      return id;
    } catch (err) {
        console.error(err)
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete a callback request
export const deleteCallbackRequest = createAsyncThunk(
  'contactCallback/deleteCallbackRequest',
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/callback/${id}`);
       Toast.success("delted")
      return id;
    } catch (err) {
         console.error(err)
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ===================== Slice ===================== //

const contactCallbackSlice = createSlice({
  name: 'contactCallback',
  initialState: {
    contactMessages: [],
    callbackRequests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch contact messages
      .addCase(fetchContactMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.contactMessages = action.payload;
      })
      .addCase(fetchContactMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch callback requests
      .addCase(fetchCallbackRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCallbackRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.callbackRequests = action.payload;
      })
      .addCase(fetchCallbackRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete contact message
      .addCase(deleteContactMessage.fulfilled, (state, action) => {
        state.contactMessages = state.contactMessages.filter(
          (item) => item.id !== action.payload
        );
      })

      // Delete callback request
      .addCase(deleteCallbackRequest.fulfilled, (state, action) => {
        state.callbackRequests = state.callbackRequests.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default contactCallbackSlice.reducer;
