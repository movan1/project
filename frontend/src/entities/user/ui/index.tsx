import { FC } from 'react';

import { Button, User } from '@nextui-org/react';

import { clearToken } from '@entities/user';

import { useUser } from '@shared/hooks';
import { useAppDispatch } from '@shared/lib';
import { UserRoles } from '@shared/types';

export const UserBadge: FC = () => {
  const dispatch = useAppDispatch();
  const { getDecodedToken } = useUser();
  const user = getDecodedToken();

  return (
    user ? (
      <div className="flex gap-10">
        <User
          description={UserRoles[user.role][0].toUpperCase() + UserRoles[user.role].slice(1)}
          name={user.name}
        />
        <Button
          color="danger"
          onClick={() => dispatch(clearToken())}
          variant="shadow"
          isIconOnly
        >
          <i className="fas fa-sign-out-alt" />
        </Button>
      </div>
    ) : null
  );
};
