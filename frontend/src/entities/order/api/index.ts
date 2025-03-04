import { createApi } from '@reduxjs/toolkit/query/react';

import { BaseQueryWithAuth } from '@shared/api';
import {
  HasId, NewWaiterOrder, Order, Statuses
} from '@shared/types';

export const ordersApi = createApi({
  baseQuery: BaseQueryWithAuth('orders'),
  endpoints: (builder) => ({
    addAdminOrder: builder.mutation<void, NewWaiterOrder>({
      invalidatesTags: ['Order'],
      query: (body) => ({
        body,
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        url: '/admin'
      })
    }),
    createUserOrder: builder.mutation<HasId, number[]>({
      query: (products) => ({
        body: { products },
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        url: '/'
      })
    }),
    editOrder: builder.mutation<void, HasId & NewWaiterOrder>({
      invalidatesTags: ['Order'],
      query: ({ id, ...body }) => ({
        body,
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
        url: `/admin/${id}`
      })
    }),
    editOrderStatus: builder.mutation<void, { status: Statuses } & HasId>({
      invalidatesTags: ['Order'],
      query: ({ id, ...body }) => ({
        body,
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
        url: `/admin/status/${id}`
      })
    }),
    getOrderByTable: builder.query<Order, number>({ query: (id) => String(id) }),
    getOrders: builder.query<Order[], void>({
      providesTags: ['Order'],
      query: () => ''
    }),
    payUserOrder: builder.mutation<void, { tips: number } & HasId>({
      invalidatesTags: ['Order'],
      query: ({ id, ...body }) => ({
        body,
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
        url: String(id)
      })
    })
  }),
  reducerPath: 'ordersApi',
  tagTypes: ['Order']
});

export const {
  useAddAdminOrderMutation,
  useCreateUserOrderMutation,
  useEditOrderMutation,
  useEditOrderStatusMutation,
  useGetOrdersQuery,
  useLazyGetOrderByTableQuery,
  usePayUserOrderMutation
} = ordersApi;
