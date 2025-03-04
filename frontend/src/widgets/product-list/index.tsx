import { FC, useState } from 'react';

import {
  Checkbox, CheckboxGroup, Input
} from '@nextui-org/react';

import { useGetProductsQuery } from '@entities/product';

export const ProductList: FC<{
  error: null | string | undefined
  onChange: (x: number[]) => void,
  value: number[],
}> = ({
  error, onChange, value
}) => {
  const { data: productList = [] } = useGetProductsQuery();
  const [search, setSearch] = useState<string>('');

  return (
    <div className="flex flex-col gap-3">
      <span className="text-medium">Блюда</span>
      <Input
        label="Поиск"
        onValueChange={setSearch}
        placeholder="Введите название блюда"
        value={search}
      />
      <CheckboxGroup
        className="h-[350px] overflow-y-scroll bg-default-100 py-2 px-3 rounded-medium"
        isInvalid={Boolean(error)}
        onValueChange={(newValue) => onChange(newValue.map((x) => Number(x)))}
        value={value.map((x) => String(x))}
      >
        {productList
          .filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
          .map((product) => (
            <Checkbox
              key={product.id}
              value={String(product.id)}
            >
              {product.name}
              {' '}
              <b>
                (
                {product.price}
                {' '}
                <i className="fas fa-ruble-sign" />
                )
              </b>
            </Checkbox>
          ))}
      </CheckboxGroup>
      {
        error && (
          <span className="text-small text-danger">{error}</span>
        )
      }
    </div>
  );
};
