import { Product } from '@shared/types';

export type Order = {
  date: string
  id: number
  name: null | string
  orderTable: null | number
  orderType: OrderType
  products: Product[]
  status: Statuses
  tips: number
  totalPrice: number
};

export type NewWaiterOrder = {
  orderTable: null | number
  products: number[]
};

export enum OrderType {
  Hall = 1,
  Self = 2
}

export enum Statuses {
  Canceled = 400,
  Completed = 200,
  Created = 100
}
