import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    
    // add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
