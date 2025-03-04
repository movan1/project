import { createApi } from '@reduxjs/toolkit/query/react';

import { BaseQueryWithAuth } from '@shared/api';
import { Table } from '@shared/types';

export const tablesApi = createApi({
  baseQuery: BaseQueryWithAuth('tables'),
  endpoints: (builder) => ({ getTablesList: builder.query<Table[], void>({ query: () => '/' }) }),
  reducerPath: 'tablesApi'
});

export const { useGetTablesListQuery } = tablesApi;
