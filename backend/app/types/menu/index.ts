type MenuSectionBase = {
  description: string
  name: string,
}

export type MenuSectionAdmin = MenuSectionBase & {
  productList: number[]
};

export type MenuSectionSQL = MenuSectionBase & {
  products: string
};
