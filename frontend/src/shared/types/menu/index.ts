import { HasId, Product } from '@shared/types';

export type MenuSectionAdmin = {
  description: string
  name: string,
  productList: number[]
};

export type MenuSection = {
  description: string
  name: string,
  productList: Product[]
};

export type MenuSectionItem = {
  name: string
} & HasId;
