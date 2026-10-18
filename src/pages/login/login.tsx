import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { loginUser } from '@services/slices/userSlice';
import { useDispatch } from '@services/store';

type TLoginState = {
  from?: { pathname?: string };
};

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as TLoginState | null)?.from?.pathname;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    setError('');
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate(from ?? '/', { replace: true });
      })
      .catch((err: Error) => setError(err.message));
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
