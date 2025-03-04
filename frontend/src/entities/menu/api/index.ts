import { createApi } from '@reduxjs/toolkit/query/react';

import { BaseQueryWithAuth } from '@shared/api';
import {
  HasId, MenuSection,
  MenuSectionAdmin,
  MenuSectionItem
} from '@shared/types';

export const menuApi = createApi({
  baseQuery: BaseQueryWithAuth('menu'),
  endpoints: (builder) => ({
    addMenu: builder.mutation<void, MenuSectionAdmin>({
      invalidatesTags: ['Menu'],
      query: (body) => ({
        body,
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        url: ''
      })
    }),
    deleteMenu: builder.mutation<void, number>({
      invalidatesTags: ['Menu'],
      query: (id) => ({
        method: 'DELETE',
        url: `/${id}`
      })
    }),
    editMenu: builder.mutation<void, HasId & MenuSectionAdmin>({
      invalidatesTags: ['Menu'],
      query: ({ id, ...body }) => ({
        body,
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        url: `/${id}`
      })
    }),
    getAdminMenu: builder.query<(HasId & MenuSectionAdmin)[], void>({
      providesTags: ['Menu'],
      query: () => '/admin'
    }),
    getMenuById: builder.query<MenuSection, number>({ query: (id) => `/section/${id}` }),
    getMenuSectionsList: builder.query<MenuSectionItem[], void>({ query: () => '/' })
  }),
  reducerPath: 'menuApi',
  tagTypes: ['Menu']
});

export const {
  useAddMenuMutation,
  useDeleteMenuMutation,
  useEditMenuMutation,
  useGetAdminMenuQuery,
  useGetMenuSectionsListQuery,
  useLazyGetMenuByIdQuery
} = menuApi;
