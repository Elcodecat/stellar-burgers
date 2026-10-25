import type { SerializedError } from '@reduxjs/toolkit';
import type { RootState } from '@services/store';
import type { TIngredient, TUser, TOrder, TConstructorState } from '@utils-types';

// --- Селекторы для ингредиентов ---
export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;
export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.loading;
export const selectIngredientsError = (state: RootState): SerializedError | null =>
  state.ingredients.error;

// --- Селекторы для пользователя ---
export const selectUser = (state: RootState): TUser | null => state.user.user;
export const selectUserName = (state: RootState): string | undefined =>
  state.user.user?.name;
export const selectIsAuthChecked = (state: RootState): boolean => state.user.checked;

// --- Селекторы для заказов ---
export const selectOrderData = (state: RootState): TOrder | null => state.order.order; // для модалки оформления
export const selectOrderByNumber = (state: RootState): TOrder | null =>
  state.order.orderByNumber; // для деталей заказа
export const selectOrders = (state: RootState): TOrder[] => state.order.orders; // список заказов
export const selectOrderLoading = (state: RootState): boolean => state.order.loading;

// --- Селекторы для ленты ---
export const selectFeedOrders = (state: RootState): TOrder[] => state.feed.orders;
export const selectFeedTotal = (state: RootState): number => state.feed.total;
export const selectFeedTotalToday = (state: RootState): number => state.feed.totalToday;

// --- Селекторы для конструктора ---
export const selectConstructorItems = (state: RootState): TConstructorState =>
  state.burgerConstructor;
