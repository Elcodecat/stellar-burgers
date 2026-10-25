import { AppHeaderUI } from '@ui';

import { selectUserName } from '@services/selectors';
import { useSelector } from '@services/store';

export const AppHeader = (): React.JSX.Element => {
  /* TODO: Получите имя пользователя из хранилища */
  const userName = useSelector(selectUserName);

  return <AppHeaderUI userName={userName} />;
};
