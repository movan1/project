import {
  FC, useEffect, useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Button, Chip, Divider
} from '@nextui-org/react';
import classNames from 'classnames';

import { ProductInCart } from '@widgets/product-in-cart';

import { useLazyGetOrderByTableQuery, usePayUserOrderMutation } from '@entities/order';

import { paths } from '@shared/router';

const tipsProcent = [
  { emojie: '😊', percent: 10 },
  { emojie: '😏', percent: 15 },
  { emojie: '😘', percent: 20 },
  { emojie: '🤩', percent: 25 }
];

export const OrderPage: FC = () => {
  const [getOrder, { data: order }] = useLazyGetOrderByTableQuery();
  const [payUserOrder] = usePayUserOrderMutation();

  const { tableId } = useParams();
  const navigate = useNavigate();
  const [tips, setTips] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSetTips = (x: number) => {
    if (x === tips) {
      setTips(0);
    } else {
      setTips(x);
    }
  };

  const handlePay = () => {
    if (!order) return;

    payUserOrder({ id: order.id, tips })
      .unwrap()
      .then(() => setSuccess(true));
  };

  useEffect(() => {
    getOrder(Number(tableId))
      .unwrap()
      .then((x) => {
        setTips(x.tips);
      })
      .catch(() => navigate(paths.order.path));
  }, []);

  if (!order) return null;

  if (success) {
    return (
      <div className="py-3 px-6 w-full flex flex-col">
        <div className="text-2xl font-bold mb-5">{`Оплата стола #${tableId}`}</div>
        <div className="flex flex-col flex-grow gap-3 mb-10 justify-center items-center">
          <div className="flex flex-col items-center text-center gap-2">
            <Chip
              classNames={{ base: 'text-3xl min-w-12 min-h-12 w-auto' }}
              color="success"
              size="lg"
              variant="flat"
            >
              Заказ успешно оплачен!
            </Chip>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-3 px-6 w-full flex flex-col">
      <div className="text-2xl font-bold mb-5">{`Оплата стола #${tableId}`}</div>
      <div className="flex flex-col flex-grow gap-3 mb-10">
        {
          order.products.map(
            (product) => <ProductInCart key={product.id} withRemove={false} {...product} />
          )
        }
      </div>
      <div className="flex flex-col gap-5">
        <Divider />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {tipsProcent.map(({ emojie, percent }) => {
            const tipsInMoney = (order.totalPrice / 100) * percent;

            return (
              <div
                className={classNames(
                  'flex flex-col justify-center items-center gap-1  p-2 rounded-2xl transition-all select-none',
                  {
                    'bg-cyan-500': tips === tipsInMoney,
                    'bg-orange-500': tips !== tipsInMoney
                  }
                )}
                onKeyDown={(e) => {
                  if (e.code === 'Enter') {
                    handleSetTips(tipsInMoney);
                  }
                }}
                aria-label={`add tips ${tipsInMoney}`}
                key={percent}
                onClick={() => handleSetTips(tipsInMoney)}
                role="button"
                tabIndex={0}
              >
                <span className="text-3xl">{emojie}</span>
                <span className="text-white inline-flex gap-2 items-center">
                  <span className="font-bold font-mono">
                    {percent}
                    %
                  </span>
                  <span>{`(${tipsInMoney} ₽)`}</span>
                </span>
              </div>
            );
          })}
        </div>
        <Button
          className="w-full text-amber-50 font-mono"
          color="success"
          onPress={handlePay}
          size="lg"
        >
          <i className="fas fa-shopping-cart" />
          {`${order.totalPrice + tips} ₽`}
        </Button>
      </div>
    </div>
  );
};
