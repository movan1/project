import { FC, useEffect } from 'react';
import {
  Link, Outlet, useLocation, useNavigate
} from 'react-router-dom';

import { Navbar, NavbarBrand } from '@nextui-org/react';
import classNames from 'classnames';

import {
  UserBadge, clearToken, setToken
} from '@entities/user';

import { useUser } from '@shared/hooks';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import { adminPaths, paths } from '@shared/router';

export const AdminPage: FC = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((store) => store.user);

  const location = useLocation();
  const navigation = useNavigate();
  const {
    getToken, isAdmin, isTokenValid
  } = useUser();
  const localToken = getToken();

  const isCurrentRoute = (url: string): boolean => location.pathname === url;

  useEffect(() => {
    if (!isTokenValid()) {
      dispatch(clearToken());
      navigation(paths.login.path);
    }

    if (localToken && localToken !== token) {
      dispatch(setToken(localToken));
    }
  }, [location, token]);

  return (
    <div>
      <Navbar
        className="bg-gray-900 text-amber-50"
        maxWidth="full"
      >
        <NavbarBrand>
          <p className="font-mono text-inherit text-3xl">La&apos;Vita</p>
        </NavbarBrand>
        <UserBadge />
      </Navbar>
      <div className="flex relative">
        <div className="bg-gray-900 text-amber-50 min-h-[calc(100vh_-_64px)] w-[200px] fixed top-[64px]">
          <div className="flex flex-col p-3 gap-2">
            {Object.values(adminPaths).slice(1)
              .filter((x) => x.isAdmin === isAdmin() || !x.isAdmin)
              .map((x) => (
                <Link
                  className={classNames(
                    'flex items-center gap-4 py-2 px-3 rounded transition',
                    { 'bg-rose-500': isCurrentRoute(x.path), 'hover:bg-gray-700': !isCurrentRoute(x.path) }
                  )}
                  key={x.path}
                  to={x.path}
                >
                  <i className={classNames(x.icon, 'basis-[20px] text-center')} />
                  {x.title}
                </Link>
              ))}
          </div>
        </div>
        <div className="p-10 flex-grow ml-[200px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
