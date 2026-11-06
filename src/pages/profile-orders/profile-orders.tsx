import { fetchOrders } from '@slices/orderSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { selectOrders } from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectOrders);
  useEffect(() => {
    void dispatch(fetchOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
