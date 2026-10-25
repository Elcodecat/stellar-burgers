import { Preloader } from '@ui';
import { Navigate, useLocation, type Location } from 'react-router-dom';

import { selectUser, selectIsAuthChecked } from '@services/selectors';
import { useSelector } from '@services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.JSX.Element;
};

type TLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  // Берем данные из userSlice
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  const location = useLocation();
  const locationState = location.state as TLocationState | null;

  // 1. Пока идет проверка токена при загрузке — показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // 2. Если маршрут только для авторизованных, а юзера нет — на логин
  if (!onlyUnAuth && !user) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  // 3. Если маршрут только для неавторизованных, а юзер есть — на главную
  if (onlyUnAuth && user) {
    const from = locationState?.from ?? { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  // 4. Всё ок — рендерим компонент
  return children;
};
