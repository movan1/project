import { createApi } from '@reduxjs/toolkit/query/react';

import { BaseQueryWithAuth } from '@shared/api';
import {
  EditableUser,
  FullUser,
  JWTToken, User, UserWithId
} from '@shared/types';

export const userApi = createApi({
  baseQuery: BaseQueryWithAuth('users'),
  endpoints: (builder) => ({
    createUser: builder.mutation<void, FullUser>({
      invalidatesTags: ['User'],
      query: (body) => ({
        body,
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        url: '/create'
      })
    }),
    deleteUser: builder.mutation<void, number>({
      invalidatesTags: ['User'],
      query: (id) => ({
        method: 'DELETE',
        url: `/${id}`
      })
    }),
    editUser: builder.mutation<void, EditableUser>({
      invalidatesTags: ['User'],
      query: ({ id, ...body }) => ({
        body,
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        url: `/${id}`
      })
    }),
    getUsers: builder.query<UserWithId[], void>({
      providesTags: ['User'],
      query: () => ''
    }),
    loginUser: builder.mutation<JWTToken, User>({
      query: (body) => ({
        body,
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        url: '/login'
      })
    })
  }),
  reducerPath: 'userApi',
  tagTypes: ['User']
});

export const {
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetUsersQuery,
  useLoginUserMutation
} = userApi;
