export type Order = {
  id: number
  date: string
  orderType: OrderType
  products: number[]
  totalPrice: number
  tips: number
  waiter_id: number | null
  name: string | null
  orderTable: number | null
  status: Statuses
}

export enum OrderType {
  Hall = 1,
  Self = 2
}

export enum Statuses {
  Created = 100,
  Completed = 200,
  Canceled = 400
}
