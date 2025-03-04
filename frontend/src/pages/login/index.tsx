import {
  FC, useEffect, useState
} from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button, Card,
  CardBody, Input
} from '@nextui-org/react';

import {
  clearToken, setToken, useLoginUserMutation
} from '@entities/user';

import { useUser } from '@shared/hooks';
import { useAppDispatch } from '@shared/lib';
import { paths } from '@shared/router';
import { User } from '@shared/types';

const errorMessage = 'Неправильный логин или пароль';
export const LoginPage: FC = () => {
  const dispatch = useAppDispatch();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const [user, setUser] = useState<User>({
    name: '',
    password: ''
  });
  const [isError, setError] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigate();
  const { isTokenValid } = useUser();

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleChangeUserField = (key: keyof User, value: User[keyof User]) => {
    setError(false);
    setUser((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLoginUser = () => {
    loginUser(user)
      .unwrap()
      .then(({ token }) => {
        dispatch(setToken(token));
        navigation(paths.adminOrders.path);
      })
      .catch(() => setError(true));
  };

  useEffect(() => {
    if (isTokenValid()) {
      navigation(paths.adminOrders.path);
    } else {
      dispatch(clearToken());
    }
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <div className="min-w-[350px] flex flex-col gap-3">
        <span className="text-2xl"><b>Авторизация</b></span>
        <Card>
          <CardBody className="gap-4">
            <Input
              errorMessage={errorMessage}
              isInvalid={isError}
              label="Логин"
              onValueChange={(x) => handleChangeUserField('name', x)}
              placeholder="Введите логин"
              autoFocus
              isRequired
            />
            <Input
              endContent={(
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  onClick={toggleVisibility}
                  type="button"
                >
                  {isVisible ? (
                    <i className="fas fa-eye" />
                  ) : (
                    <i className="fas fa-eye-slash" />
                  )}
                </button>
              )}
              errorMessage={errorMessage}
              isInvalid={isError}
              label="Пароль"
              onValueChange={(x) => handleChangeUserField('password', x)}
              placeholder="Введите пароль"
              type={isVisible ? 'text' : 'password'}
              isRequired
            />
            <Button
              className="w-[70%] mx-auto"
              color="primary"
              isLoading={isLoading}
              onPress={handleLoginUser}
            >
              Войти
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
