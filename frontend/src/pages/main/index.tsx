import { FC } from 'react';
import { Link } from 'react-router-dom';

import { SquareLogo } from '@shared/assets';
import { userPaths } from '@shared/router';

export const MainPage: FC = () => (
  <div className="flex-grow flex items-center justify-center border-1">
    <div className="flex flex-col gap-5 w-10/12">
      <div className="flex flex-col justify-center items-center">
        <div className="text-6xl mb-14 font-sans flex items-end justify-center gap-2">
          <img alt="" className="w-1/4" src={SquareLogo} />
          {' '}
          <span className="translate-y-2 text-4xl font-bold font-sacramento">Кулинария</span>
        </div>
      </div>
      {Object.values(userPaths).map((x, i) => i !== 0 && (
        <Link
          className="flex gap-2 items-center justify-center text-xl p-2 bg-green-600 hover:bg-green-700 transition text-white rounded-md"
          key={x.path}
          to={x.path}
        >
          <i className={x.icon} />
          {x.title}
        </Link>
      ))}
    </div>
  </div>
);
