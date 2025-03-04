import {
  FC, useEffect, useState
} from 'react';
import { Link } from 'react-router-dom';

import {
  Button, Chip, Divider
} from '@nextui-org/react';
import classNames from 'classnames';

import { ProductInCart } from '@widgets/product-in-cart';

import { useCreateUserOrderMutation } from '@entities/order';
import { useGetProductsByIDsMutation } from '@entities/product';

import { useProduct } from '@shared/hooks';
import { useAppSelector } from '@shared/lib';
import { paths } from '@shared/router';

export const CartPage: FC = () => {
  const { cart } = useAppSelector((store) => store.cart);

  const [
    loadProducts, {
      data: productsList = [],
      isLoading
    }
  ] = useGetProductsByIDsMutation();
  const [createOrder, { data: order }] = useCreateUserOrderMutation();

  const [isInit, setInit] = useState<boolean>(true);
  const { clearCart } = useProduct();

  const totalPrice = productsList.filter((x) => cart.includes(x.id)).reduce((acc, x) => {
    acc += x.price;
    return acc;
  }, 0);

  const handleCreateOrder = () => {
    const currentCart = productsList
      .filter((x) => cart.includes(x.id))
      .map((x) => x.id);

    createOrder(currentCart)
      .unwrap()
      .then(() => clearCart());
  };

  useEffect(() => {
    if (cart.length > 0 && isInit) {
      loadProducts(cart)
        .unwrap()
        .then(() => setInit(false))
        .catch(() => clearCart());
    }
  }, [cart]);

  return (
    <div className="py-3 px-6 w-full flex flex-col">
      <div className="text-2xl font-bold mb-5">Корзина</div>
      {
        !isLoading && !order && cart.length === 0 && (
          <div className="text-center">
            Корзина пуста, Вы можете её пополнить если зайдёте в
            {' '}
            <Link
              className="underline font-bold font-xl text-primary-400"
              to={paths.menu.path}
            >
              Меню
            </Link>
          </div>
        )
      }
      <div className={classNames(
        'flex flex-col flex-grow gap-3 mb-10',
        { 'justify-center items-center': order !== undefined }
      )}
      >
        {
          productsList
            .filter((x) => cart.includes(x.id))
            .map((product) => <ProductInCart key={product.id} withRemove {...product} />)
        }
        {
          order && (
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-success font-bold text-md">Вы успешно оформили заказ, его номер:</span>
              <Chip
                classNames={{ base: 'text-3xl min-w-12 min-h-12 w-auto' }}
                color="success"
                size="lg"
                variant="flat"
              >
                {order.id}
              </Chip>
            </div>
          )
        }
      </div>
      {
        cart.length > 0 && (
          <div className="flex flex-col gap-5">
            <Divider />
            <Button
              className="w-full text-amber-50 font-mono"
              color="success"
              onPress={handleCreateOrder}
              size="lg"
            >
              <i className="fas fa-shopping-cart" />
              {`${totalPrice} ₽`}
            </Button>
          </div>
        )
      }
    </div>
  );
};
