import { createApi } from '@reduxjs/toolkit/query/react';

import { BaseQueryWithAuth } from '@shared/api';
import { Table } from '@shared/types';

export const tablesApi = createApi({
  baseQuery: BaseQueryWithAuth('tables'),
  endpoints: (builder) => ({
    getFreeTablesList: builder.query<Table[], void>({ query: () => '/free' }),
    getTablesList: builder.query<Table[], void>({ query: () => '/' })
  }),
  reducerPath: 'tablesApi'
});

export const {
  useGetFreeTablesListQuery,
  useGetTablesListQuery
} = tablesApi;
