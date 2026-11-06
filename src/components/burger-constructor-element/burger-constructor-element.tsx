import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';

import {
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient,
} from '@services/slices/constructorSlice';
import { useDispatch } from '@services/store';

import type { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();

  const handleMoveDown = (): void => {
    // TODO
    if (index < totalItems - 1) {
      dispatch(moveIngredientDown(index));
    }
  };

  const handleMoveUp = (): void => {
    // TODO
    if (index > 0) {
      dispatch(moveIngredientUp(index));
    }
  };

  const handleClose = (): void => {
    // TODO
    dispatch(removeIngredient(ingredient.id));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
