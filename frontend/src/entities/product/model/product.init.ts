import { Product, WeightType } from '@shared/types';

import { ProductState } from './product';

export const initialState: ProductState = { productList: [] };

export const defaultProduct: Omit<Product, 'id'> = {
  description: '',
  inStopList: false,
  name: '',
  preview: '',
  price: 0,
  weight: 0,
  weightType: WeightType.Gramm
};
