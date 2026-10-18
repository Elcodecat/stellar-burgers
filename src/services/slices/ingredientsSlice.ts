import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils-types';
export const fetchIngredients = createAsyncThunk('ingredients/fetch', getIngredientsApi);
type State = { items: TIngredient[]; loading: boolean; error: SerializedError | null };
const initialState: State = { items: [], loading: false, error: null };
const slice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchIngredients.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchIngredients.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchIngredients.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error; //'Ошибка загрузки'
      });
  },
});
export default slice.reducer;
