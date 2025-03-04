export type Product = {
  description: string
  id: number
  inStopList: boolean
  name: string
  preview: string
  price: number
  weight: number
  weightType: WeightType
};

export type ProductSQL = Omit<Product, 'inStopList'> & {
  inStopList: number
};

export enum WeightType {
  Gramm = 1,
  Milliliter = 2
}
