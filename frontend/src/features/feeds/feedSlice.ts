// src/features/feeds/feedSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Feed {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  content: string;
  image?: string;
  createdAt: string;
}

interface FeedState {
  feeds: Feed[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  feeds: [],
  loading: false,
  error: null,
};

export const fetchFeeds = createAsyncThunk('feeds/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/feeds');
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch feeds');
  }
});

export const createPost = createAsyncThunk(
    'feeds/createPost',
    async (postData: { content: string; image?: string; userId: string }, { rejectWithValue }) => {
      try {
        const response = await axios.post('/api/feeds', postData);
        return response.data;
      } catch (error) {
        return rejectWithValue('Failed to create post');
      }
    }
  );

const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    clearFeedError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action: PayloadAction<Feed[]>) => {
        state.loading = false;
        state.feeds = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<{ feed: Feed }>) => {
        state.loading = false;
        state.feeds.unshift(action.payload.feed);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFeedError } = feedSlice.actions;
export default feedSlice.reducer;