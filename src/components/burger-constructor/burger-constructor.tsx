import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  selectConstructorItems,
  selectUser,
  selectOrderLoading,
  selectOrderData,
} from '@services/selectors';
import { clearConstructor } from '@services/slices/constructorSlice';
import { createOrder, clearOrder } from '@services/slices/orderSlice';
import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /** TODO: Взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems: TConstructorState = useSelector(selectConstructorItems);

  const orderRequest = useSelector(selectOrderLoading);
  const user = useSelector(selectUser);

  const orderModalData: TOrder | null = useSelector(selectOrderData);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    // TODO: Оформить заказ
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id,
    ];
    void dispatch(createOrder(ingredientIds)).then((result) => {
      if (createOrder.fulfilled.match(result)) {
        dispatch(clearConstructor());
      }
    });
  };

  const closeOrderModal = (): void => {
    // TODO: Закрыть модальное окно и сбросить заказ
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
