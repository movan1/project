export type Product = {
  description: string
  id: number
  inStopList: boolean
  name: string
  preview?: string
  price: number
  weight: number
  weightType: WeightType
};

export enum WeightType {
  Gramm = 1,
  Milliliter = 2
}

export type ProductWithoutID = Omit<Product, 'id'>;
