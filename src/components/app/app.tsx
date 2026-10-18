import { AppHeader, Modal } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  type Location,
} from 'react-router-dom';

import { fetchIngredients } from '@services/slices/ingredientsSlice';
import { useDispatch, useSelector } from '@services/store';

import { IngredientDetails } from '../../components/ingredient-details/ingredient-details';
import { OrderInfo } from '../../components/order-info/order-info';

import type { AppContentProps } from './type';
import type { TIngredient } from '@utils-types';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ingredients: TIngredient[] = useSelector((state) => state.ingredients.items);
  const isIngredientsLoading = useSelector((state) => state.ingredients.loading);
  const ingredientsError = useSelector((state) => state.ingredients.error);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

type TLocationState = {
  backgroundLocation?: Location;
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state as TLocationState | null;
  const backgroundLocation = locationState?.backgroundLocation;

  const handleClose = (): void => {
    void navigate(-1);
  };
  return (
    <>
      {' '}
      <Routes location={backgroundLocation ?? location}>
        {' '}
        <Route path="/" element={<ConstructorPage />} />{' '}
        <Route path="/feed" element={<Feed />} />{' '}
        <Route path="/login" element={<Login />} />{' '}
        <Route path="/register" element={<Register />} />{' '}
        <Route path="/forgot-password" element={<ForgotPassword />} />{' '}
        <Route path="/reset-password" element={<ResetPassword />} />{' '}
        <Route path="/profile" element={<Profile />} />{' '}
        <Route path="/profile/orders" element={<ProfileOrders />} />{' '}
        <Route path="/ingredients/:id" element={<IngredientDetails />} />{' '}
        <Route path="/feed/:number" element={<OrderInfo />} />{' '}
        <Route path="/profile/orders/:number" element={<OrderInfo />} />{' '}
        <Route path="*" element={<NotFound404 />} />{' '}
      </Routes>{' '}
      {backgroundLocation && (
        <Routes>
          {' '}
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleClose}>
                {' '}
                <IngredientDetails />{' '}
              </Modal>
            }
          />{' '}
          <Route
            path="/feed/:number"
            element={
              <Modal title="Информация о заказе" onClose={handleClose}>
                {' '}
                <OrderInfo />{' '}
              </Modal>
            }
          />{' '}
          <Route
            path="/profile/orders/:number"
            element={
              <Modal title="Информация о заказе" onClose={handleClose}>
                {' '}
                <OrderInfo />{' '}
              </Modal>
            }
          />{' '}
        </Routes>
      )}{' '}
    </>
  );
};
