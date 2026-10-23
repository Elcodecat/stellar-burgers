import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';
export const fetchFeed = createAsyncThunk('feed/fetch', getFeedsApi);
export const fetchUserOrders = createAsyncThunk('feed/userOrders', getOrdersApi);
type State = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};
const initialState: State = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
};
const slice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchFeed.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchFeed.fulfilled, (s, a) => {
        s.loading = false;
        s.orders = a.payload.orders;
        s.total = a.payload.total;
        s.totalToday = a.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? 'Ошибка загрузки';
      })
      .addCase(fetchUserOrders.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (s, a) => {
        s.loading = false;
        s.orders = a.payload;
      })
      .addCase(fetchUserOrders.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? 'Ошибка загрузки';
      });
  },
});
export default slice.reducer;
