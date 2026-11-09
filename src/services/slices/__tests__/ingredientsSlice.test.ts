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

    // Передаем состояние с ошибкой, чтобы проверить, что pending её сбрасывает
    const state = reducer(
      { ...initialState, error: { message: 'Старая ошибка' } },
      action
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull(); // Проверяем, что ошибка очистилась
  });

  test('должен обрабатывать fetchIngredients.fulfilled', () => {
    const action = { type: fetchIngredients.fulfilled.type, payload: mockIngredients };

    // Передаем состояние, где loading = true (как будто запрос еще идет)
    const state = reducer({ ...initialState, loading: true }, action);

    expect(state.items).toEqual(mockIngredients);
    expect(state.loading).toBe(false); // Проверяем, что загрузка завершилась
  });

  test('должен обрабатывать fetchIngredients.rejected', () => {
    const action = { type: fetchIngredients.rejected.type, error: { message: 'Error' } };

    // Передаем состояние, в котором loading уже true (как будто мы в процессе загрузки)
    const state = reducer({ ...initialState, loading: true }, action);

    expect(state.loading).toBe(false); // Проверяем, что он переключился на false
    expect(state.error).toEqual({ message: 'Error' });
  });
});
