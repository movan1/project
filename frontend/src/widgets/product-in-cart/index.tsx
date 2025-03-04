import { FC } from 'react';

import { Button, Image } from '@nextui-org/react';

import { ProductWeight } from '@shared/ui/product-weight';

import { useProduct } from '@shared/hooks';
import { Product } from '@shared/types';

export const ProductInCart: FC<{ withRemove: boolean } & Product> = (props) => {
  const {
    description,
    id,
    name,
    preview,
    price,
    weight,
    weightType,
    withRemove
  } = props;

  const { removeProduct } = useProduct();

  return (
    <div
      className="p-3 bg-gray-100 rounded-3xl flex items-center gap-4"
      key={id}
    >
      <div className="w-1/3 flex justify-center items-center">
        <Image
          classNames={{ img: 'max-h-40' }}
          src={preview}
        />
      </div>
      <div className="w-2/3 flex flex-col gap-3 justify-between h-full">
        <div>
          <span className="text-sm">{name}</span>
          <p className="text-xs text-gray-400 mb-2">{description}</p>
          <ProductWeight
            type={weightType}
            weight={weight}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold front-mono">
            {price}
            {' '}
            ₽
          </span>
          {
            withRemove && (
              <Button
                className="text-amber-50 font-mono"
                color="danger"
                onPress={() => removeProduct(id)}
                size="sm"
                isIconOnly
              >
                <i className="fas fa-trash-alt" />
              </Button>
            )
          }
        </div>
      </div>
    </div>
  );
};
