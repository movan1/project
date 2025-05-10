import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Order } from '@shared/types';

export const orderSlice = createSlice({
  initialState: { orders: [] as Order[] },
  name: 'orders',
  reducers: {
    handleSetOrders: (
      state,
      action: PayloadAction<Order[]>
    ) => {
      state.orders = action.payload;
    }
  }
});

export const { handleSetOrders } = orderSlice.actions;
