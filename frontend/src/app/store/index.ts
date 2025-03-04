import { configureStore } from '@reduxjs/toolkit';

import { cartSlice } from '@entities/cart';
import { menuApi } from '@entities/menu';
import { ordersApi } from '@entities/order';
import { productApi, productSlice } from '@entities/product';
import { tablesApi } from '@entities/table';
import { userApi, userSlice } from '@entities/user';

export const store = configureStore({
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(userApi.middleware)
      .concat(menuApi.middleware)
      .concat(ordersApi.middleware)
      .concat(tablesApi.middleware)
  ),
  reducer: {
    [cartSlice.name]: cartSlice.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [productSlice.name]: productSlice.reducer,
    [tablesApi.reducerPath]: tablesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [userSlice.name]: userSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
