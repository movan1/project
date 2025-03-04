import { JwtPayload } from 'jwt-decode';

import { HasId } from '@shared/types';

export type JWTToken = {
  token: string
};

export type User = {
  name: string
  password: string
};

export type FullUser = {
  role: UserRoles
} & User;

export type UserWithId = HasId & Omit<FullUser, 'password'>;

export type EditableUser = FullUser & HasId;

export type UserToken = JwtPayload & Pick<FullUser, 'name' | 'role'>;

export enum UserRoles {
  Admin = 2,
  User = 1
}
