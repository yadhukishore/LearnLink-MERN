import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from '../../features/auth/authSlice';
import adminReducer from '../../features/admin/adminSlice';
import tutorReducer from '../../features/tutor/tutorSlice';
import wishlistReducer from '../../features/wishlist/wishlistSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  tutor: tutorReducer,
  wishlist:wishlistReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
