import reducer, { fetchIngredients } from '../ingredientsSlice';

describe('Тестирование редьюсера ingredients', () => {
  const initialState = { items: [], loading: false, error: null };
  const mockIngredients = [{ _id: '1', name: 'Булка' }];

  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('должен обрабатывать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state).toEqual({ ...initialState, loading: true, error: null });
  });

  test('должен обрабатывать fetchIngredients.fulfilled', () => {
    const action = { type: fetchIngredients.fulfilled.type, payload: mockIngredients };
    const state = reducer(initialState, action);
    expect(state).toEqual({ ...initialState, items: mockIngredients, loading: false });
  });

  test('должен обрабатывать fetchIngredients.rejected', () => {
    const action = { type: fetchIngredients.rejected.type, error: { message: 'Error' } };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toEqual({ message: 'Error' });
  });
});
