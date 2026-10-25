import { orderBurgerApi, getOrdersApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';
export const createOrder = createAsyncThunk('order/create', async (ids: string[]) => {
  const r = await orderBurgerApi(ids);
  return r.order;
});

export const fetchOrders = createAsyncThunk('order/fetch', getOrdersApi);

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  getOrderByNumberApi
);

type State = {
  order: TOrder | null;
  orders: TOrder[];
  orderByNumber: TOrder | null;
  loading: boolean;
  error: string | null;
};
const slice = createSlice({
  name: 'order',
  initialState: {
    order: null,
    orders: [],
    orderByNumber: null,
    loading: false,
    error: null,
  } as State,
  reducers: {
    clearOrder(s) {
      s.order = null;
      s.error = null;
    },
  },
  extraReducers: (b) =>
    b
      .addCase(createOrder.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createOrder.fulfilled, (s, a) => {
        s.loading = false;
        s.order = a.payload;
      })
      .addCase(createOrder.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? 'Не удалось оформить заказ';
      })
      .addCase(fetchOrders.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchOrders.fulfilled, (s, a) => {
        s.loading = false;
        s.orders = a.payload;
      })
      .addCase(fetchOrders.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? 'Не удалось загрузить заказы';
      })
      .addCase(getOrderByNumber.pending, (s) => {
        s.loading = true;
        s.orderByNumber = null;
        s.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (s, a) => {
        s.loading = false;
        s.orderByNumber = a.payload.orders[0] ?? null;
      })
      .addCase(getOrderByNumber.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? 'Ошибка загрузки заказа';
      }),
});
export const { clearOrder } = slice.actions;
export default slice.reducer;
