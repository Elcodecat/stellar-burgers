import { FeedInfoUI } from '@ui';

import { useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const orders: TOrder[] = useSelector((state) => state.feed.orders);
  const total = useSelector((state) => state.feed.total);
  const totalToday = useSelector((state) => state.feed.totalToday);

  const feed = {
    orders,
    total,
    totalToday,
    isLoading: false,
    error: null,
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
