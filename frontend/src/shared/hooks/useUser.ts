import { jwtDecode } from 'jwt-decode';

import {
  FullUser, UserRoles, UserToken
} from '@shared/types';

type UserUser = {
  getDecodedToken: () => Pick<FullUser, 'name' | 'role'> | null
  getToken: () => null | string,
  isAdmin: () => boolean
  isTokenValid: () => boolean
};

export const useUser = (): UserUser => {
  const decodeToken = (x: string) => jwtDecode(x) as UserToken;

  const isTokenValid = () => {
    const token = localStorage.getItem('token');

    if (!token) return false;
    try {
      const decoded = decodeToken(token);
      if (!decoded.exp || decoded.exp < Date.now() / 1000) return false;
      if (!decoded.name || !decoded.role) return false;

      return true;
    } catch (_) {
      return false;
    }
  };

  return {
    getDecodedToken: () => {
      if (isTokenValid()) {
        const token = localStorage.getItem('token') as string;
        return decodeToken(token);
      }
      return null;
    },
    getToken: () => localStorage.getItem('token'),
    isAdmin: () => {
      if (isTokenValid()) {
        const token = localStorage.getItem('token');
        const { role } = decodeToken(token!);

        return role === UserRoles.Admin;
      }
      return false;
    },
    isTokenValid
  };
};
