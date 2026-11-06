import { combineReducers } from '@reduxjs/toolkit';

import burgerConstructor from '../services/slices/constructorSlice';
import feed from '../services/slices/feedSlice';
import ingredients from '../services/slices/ingredientsSlice';
import order from '../services/slices/orderSlice';
import user from '../services/slices/userSlice';

// TODO: Заменить на настоящий корневой редьюсер
export const rootReducer = combineReducers({
  // TODO: Собрать здесь редьюсеры слайсов
  ingredients,
  burgerConstructor,
  feed,
  user,
  order,
});
