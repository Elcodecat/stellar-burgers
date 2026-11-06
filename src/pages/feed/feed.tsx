import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchFeed } from '@services/slices/feedSlice';
import { useDispatch, useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

export const Feed = (): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const dispatch = useDispatch();
  useEffect(() => {
    void dispatch(fetchFeed());
  }, [dispatch]);

  const orders: TOrder[] = useSelector((state) => state.feed.orders);

  const handleGetFeeds = (): void => {
    // TODO: Запросить ленту заказов
    void dispatch(fetchFeed());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
