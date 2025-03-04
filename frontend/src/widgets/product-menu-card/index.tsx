import { FC } from 'react';

import {
  Button, Card, CardBody, CardFooter, Image
} from '@nextui-org/react';

import { ProductWeight } from '@shared/ui/product-weight';

import { useProduct } from '@shared/hooks';
import { useAppSelector } from '@shared/lib';
import { Product } from '@shared/types';

export const ProductMenuCard: FC<Product> = (props) => {
  const {
    description,
    id,
    name,
    preview,
    price,
    weight,
    weightType
  } = props;

  const { cart } = useAppSelector((store) => store.cart);
  const { addProduct, removeProduct } = useProduct();

  return (
    <Card key={id}>
      <CardBody className="overflow-visible p-0 flex-grow-0">
        <Image
          alt={name}
          className="w-full h-full object-contain p-3"
          classNames={{ zoomedWrapper: 'flex items-center h-[200px] border-b-1 border-b-gray-200' }}
          radius="none"
          src={preview}
          width="100%"
          isZoomed
        />
      </CardBody>
      <CardFooter className="justify-between items-start flex-col gap-5 flex-grow">
        <div className="flex flex-col gap-2 mb-auto">
          <b className="text-sm leading-4">{name}</b>
          <p className="text-xs text-default-500">{description}</p>
        </div>
        <div className="flex gap-3 items-end w-full">
          {
            cart.includes(id) ? (
              <Button
                className="w-full text-amber-50 font-mono"
                color="danger"
                onPress={() => removeProduct(id)}
                size="sm"
              >
                <i className="fas fa-trash-alt" />
                Убрать
              </Button>
            ) : (
              <Button
                className="w-full text-amber-50 font-mono"
                color="success"
                onPress={() => addProduct(id)}
                size="sm"
              >
                <i className="fas fa-shopping-cart" />
                {`${price} ₽`}
              </Button>
            )
          }
          <ProductWeight
            type={weightType}
            weight={weight}
          />
        </div>
      </CardFooter>
    </Card>
  );
};
