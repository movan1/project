import { FC } from 'react';
import { Link } from 'react-router-dom';

import { userPaths } from '@shared/router';

export const MainPage: FC = () => (
  <div className="flex-grow flex items-center justify-center bg-neutral-700">
    <div className="flex flex-col gap-5 w-10/12">
      <div className="flex flex-col justify-center items-center text-white font-sacramento">
        <span className="text-8xl">la Vita</span>
        <span className="text-4xl -mt-5">restaurant</span>
      </div>
      {Object.values(userPaths).map((x, i) => i !== 0 && (
        <Link
          className="flex gap-2 items-center justify-center text-xl p-2 bg-orange-600 text-white rounded-md"
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
