import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Course {
  _id: string;
  name: string;
  price: number;
  thumbnail: {
    url: string;
  };
}

interface WishlistState {
  items: Course[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Course>) => {
      const exists = state.items.some(item => item._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    clearWishlist: (state) => {
      state.items.length = 0;
    },
    setWishlist: (state, action: PayloadAction<Course[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;