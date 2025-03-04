import {
  BaseQueryApi, FetchArgs, fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

export const apiUrl = import.meta.env.VITE_API_URL;

export const BaseQueryWithAuth = (url: string) => async (
  args: FetchArgs | string,
  api: BaseQueryApi,
  extraOptions: object
) => {
  const result = await fetchBaseQuery({
    baseUrl: `${apiUrl}/${url}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  })(args, api, extraOptions);

  if (
    result.error
    && result.error.status === 401
  ) {
    api.dispatch({ type: 'user/clearToken' });
  }

  return result;
};
