import { useState } from 'react';

import {
  Button, Chip, Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure
} from '@nextui-org/react';
import classNames from 'classnames';

import { ProductWeight } from '@shared/ui/product-weight';

import { useOrders } from '@shared/hooks';
import { useAppSelector } from '@shared/lib';
import { Statuses } from '@shared/types';

export const OrdersPage = () => {
  const { orders } = useAppSelector((store) => store.orders);

  const {
    isOpen, onClose, onOpen, onOpenChange
  } = useDisclosure();
  const { cancelOrder } = useOrders();

  const [orderId, setOrderId] = useState<null | number>(null);

  const handleOpenModal = (id: number) => {
    setOrderId(id);
    onOpen();
  };

  const handleCloseModal = () => {
    setOrderId(null);
    onClose();
  };

  return (
    <div className="py-3 px-6 w-full flex flex-col">
      <div className="text-2xl font-bold mb-5">Заказы</div>
      {
        orders.length === 0 && (
          <div className="text-center text-2xl text-slate-400 pt-10">Заказов нет</div>
        )
      }
      {
        orders.map((order, i) => (
          <div
            className={classNames('p-3 bg-slate-200 rounded-md', { 'mb-3': i !== orders.length - 1 })}
            key={order.id}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-end gap-3">
                <div className="text-lg font-bold">
                  Заказ #
                  {order.id}
                </div>
                <span className="text-sm text-gray-500 pb-0.5">
                  {new Date(order.date).toLocaleString()}
                </span>
              </div>
              { order.status === Statuses.Completed && <Chip color="success" size="sm">Оплачен</Chip> }
              { order.status === Statuses.Canceled && <Chip color="danger" size="sm">Отменен</Chip> }
            </div>
            <div>
              {
                order.products.map((product) => (
                  <div
                    className="flex bg-slate-100 rounded-md p-2 mt-2"
                    key={`order-${order.id}-product-${product.id}`}
                  >
                    <div className="w-1/4 flex justify-center items-center">
                      <Image
                        classNames={{ img: 'max-h-20' }}
                        src={product.preview}
                      />
                    </div>
                    <div className="w-3/4 flex flex-col gap-3 justify-between h-full pl-2">
                      <div>
                        <span className="text-sm">{product.name}</span>
                        <p className="text-xs text-gray-400 mb-2">{product.description}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <ProductWeight
                          type={product.weightType}
                          weight={product.weight}
                        />
                        <span className="font-bold front-mono">
                          {product.price}
                          {' '}
                          ₽
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
            {
              order.status === Statuses.Created && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Button
                    className="grow"
                    color="danger"
                    onPress={() => handleOpenModal(order.id)}
                  >
                    Отменить
                  </Button>
                  <Button
                    className="grow"
                    color="success"
                  >
                    Оплатить
                    {' '}
                    <b>
                      {order.totalPrice}
                      {' '}
                      ₽
                    </b>
                  </Button>
                </div>
              )
            }
          </div>
        ))
      }
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onOpenChange={onOpenChange}
        size="sm"
      >
        <ModalContent>
          <ModalHeader className="text-center" />
          <ModalBody>
            <div className="text-xl text-center font-bold">
              Отменить заказ #
              {orderId}
              ?
            </div>
            <Button
              className="grow w-2/3 mx-auto"
              color="danger"
              onPress={() => orderId !== null && cancelOrder(orderId)}
            >
              Отменить
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};
