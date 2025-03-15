import { FC } from 'react';
import {
  Link, Outlet, useLocation
} from 'react-router-dom';

import { Badge } from '@nextui-org/react';
import classNames from 'classnames';

import { useAppSelector } from '@shared/lib';
import { userPaths } from '@shared/router';

export const IndexLayout: FC = () => {
  const { cart } = useAppSelector((store) => store.cart);

  const location = useLocation();

  const isRouteActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-[100vh] pb-[68px] flex w-full max-w-[768px] mx-auto border-l-gray-300 border-r-gray-300 border-l-1 border-r-1">
      <Outlet />
      <div className="fixed w-full bottom-0 bg-green-600 grid grid-cols-4 gap-1 z-20  max-w-[768px]">
        {Object.values(userPaths).map((x) => (
          <Link
            className={classNames(
              'flex flex-col justify-center items-center gap-1 p-2 transition-all text-white',
              { 'scale-110': isRouteActive(x.path) },
              { 'opacity-60': !isRouteActive(x.path) }
            )}
            key={x.path}
            to={x.path}
          >
            {x.path === '/cart' ? (
              <Badge
                classNames={{ badge: 'top-2 -right-1' }}
                color="danger"
                content={cart.length}
                isInvisible={cart.length === 0}
              >
                <i className={classNames(x.icon, 'text-2xl')} />
              </Badge>
            ) : (
              <i className={classNames(x.icon, 'text-2xl')} />
            )}
            <span className="text-xs">{x.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
