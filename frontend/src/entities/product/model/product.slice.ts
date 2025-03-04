import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Product } from '@shared/types';

import { initialState } from './product.init';

export const productSlice = createSlice({
  initialState,
  name: 'product',
  reducers: {
    handleSetProductList: (
      state,
      action: PayloadAction<Product[]>
    ) => {
      state.productList = action.payload;
    }
  }
});

export const { handleSetProductList } = productSlice.actions;
