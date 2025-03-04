import { createApi } from '@reduxjs/toolkit/query/react';

import { BaseQueryWithAuth } from '@shared/api';
import { Product, ProductWithoutID } from '@shared/types';

export const productApi = createApi({
  baseQuery: BaseQueryWithAuth('products'),
  endpoints: (builder) => ({
    addProduct: builder.mutation<void, ProductWithoutID>({
      invalidatesTags: ['Product'],
      query: (body) => ({
        body,
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        url: ''
      })
    }),
    deleteProduct: builder.mutation<void, number>({
      invalidatesTags: ['Product'],
      query: (id) => ({
        method: 'DELETE',
        url: `/${id}`
      })
    }),
    editProduct: builder.mutation<void, Product>({
      invalidatesTags: ['Product'],
      query: ({ id, ...body }) => ({
        body,
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        url: `/${id}`
      })
    }),
    getProducts: builder.query<Product[], void>({
      providesTags: ['Product'],
      query: () => ''
    }),
    getProductsByIDs: builder.mutation<Product[], number[]>({
      query: (products) => ({
        body: { products },
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        url: '/products'
      })
    })
  }),
  reducerPath: 'productApi',
  tagTypes: ['Product']
});

export const {
  useAddProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetProductsByIDsMutation,
  useGetProductsQuery
} = productApi;
