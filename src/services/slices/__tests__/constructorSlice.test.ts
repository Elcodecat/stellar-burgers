import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
} from '../constructorSlice';

describe('Тестирование редьюсера burgerConstructor', () => {
  const bun = {
    _id: '1',
    name: 'Булка',
    price: 100,
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    image: '',
    image_large: '',
    image_mobile: '',
  };

  const ingredient = {
    _id: '2',
    name: 'Мясо',
    price: 200,
    type: 'main',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 200,
    image: '',
    image_large: '',
    image_mobile: '',
  };

  const ingredient2 = {
    _id: '3',
    name: 'Сыр',
    price: 50,
    type: 'sauce',
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 50,
    image: '',
    image_large: '',
    image_mobile: '',
  };

  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  test('должен добавлять булку', () => {
    const action = addIngredient(bun);
    const state = reducer(undefined, action);
    expect(state.bun).toEqual({ ...bun, id: expect.any(String) as string });
  });

  test('должен добавлять ингредиенты', () => {
    const action = addIngredient(ingredient);
    const state = reducer(undefined, action);
    expect(state.ingredients[0]).toEqual({
      ...ingredient,
      id: expect.any(String) as string,
    });
  });

  test('должен удалять ингредиент', () => {
    const addedState = reducer(undefined, addIngredient(ingredient));
    const id = addedState.ingredients[0].id;
    const state = reducer(addedState, removeIngredient(id));
    expect(state.ingredients).toHaveLength(0);
  });

  test('должен очищать конструктор', () => {
    let state = reducer(undefined, addIngredient(bun));
    state = reducer(state, addIngredient(ingredient));
    state = reducer(state, clearConstructor());
    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  test('должен перемещать ингредиенты вверх и вниз', () => {
    // Сначала добавим два ингредиента
    let state = reducer(undefined, addIngredient(ingredient)); // 'Мясо'
    state = reducer(state, addIngredient(ingredient2)); // 'Сыр'

    // Изначально: [Мясо, Сыр]. Индекс 'Сыра' = 1
    expect(state.ingredients[0].name).toBe('Мясо');
    expect(state.ingredients[1].name).toBe('Сыр');

    // Перемещаем 'Сыр' вверх (он станет первым)
    state = reducer(state, moveIngredientUp(1));
    expect(state.ingredients[0].name).toBe('Сыр');
    expect(state.ingredients[1].name).toBe('Мясо');

    // Перемещаем 'Сыр' обратно вниз
    state = reducer(state, moveIngredientDown(0));
    expect(state.ingredients[0].name).toBe('Мясо');
    expect(state.ingredients[1].name).toBe('Сыр');
  });
});
