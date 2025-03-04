import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  initialState: { cart: [] as number[] },
  name: 'cart',
  reducers: {
    handleSetCart: (
      state,
      action: PayloadAction<number[]>
    ) => {
      state.cart = action.payload;
    }
  }
});

export const { handleSetCart } = cartSlice.actions;
