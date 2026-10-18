import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

const initialState: TConstructorState = { bun: null, ingredients: [] };

const slice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer(s, a: PayloadAction<TConstructorIngredient>) {
        const i = a.payload;
        if (i.type === 'bun') s.bun = i;
        else s.ingredients.push(i);
      },

      prepare(i: TIngredient) {
        return { payload: { ...i, id: nanoid() } };
      },
    },

    removeIngredient(s, a: PayloadAction<string>) {
      s.ingredients = s.ingredients.filter((i) => i.id !== a.payload);
    },

    moveIngredientUp(s, a: PayloadAction<number>) {
      const index = a.payload;

      if (index <= 0 || index >= s.ingredients.length) return;

      const [item] = s.ingredients.splice(index, 1);

      if (item) s.ingredients.splice(index - 1, 0, item);
    },

    moveIngredientDown(s, a: PayloadAction<number>) {
      const index = a.payload;

      if (index < 0 || index >= s.ingredients.length - 1) return;

      const [item] = s.ingredients.splice(index, 1);

      if (item) s.ingredients.splice(index + 1, 0, item);
    },

    clearConstructor(s) {
      s.bun = null;
      s.ingredients = [];
    },
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
} = slice.actions;
export default slice.reducer;
