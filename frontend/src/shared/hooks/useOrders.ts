import { useEffect } from 'react';

import {
  handleSetOrders, useEditOrderStatusMutation, useGetOrdersByIdsMutation, usePayUserOrderMutation
} from '@entities/order';

import { useAppDispatch } from '@shared/lib';
import { Statuses } from '@shared/types';

import { useLocalStorage } from './useLocalStorage';

const ordersKey = 'orders';

export const useOrders = () => {
  const {
    get, remove, set
  } = useLocalStorage();

  const dispatch = useAppDispatch();

  const [getOrdersByIds] = useGetOrdersByIdsMutation();
  const [changeStatus] = useEditOrderStatusMutation();
  const [payUserOrder] = usePayUserOrderMutation();

  const getUserOrders = () => {
    const localOrdersIds = get(ordersKey);
    if (localOrdersIds) {
      try {
        const parsedOrders = JSON.parse(localOrdersIds);
        if (
          Array.isArray(parsedOrders)
          && parsedOrders.every((x) => typeof x === 'number')
        ) {
          getOrdersByIds(parsedOrders as number[])
            .then((orders) => {
              if (orders.data) {
                dispatch(handleSetOrders(orders.data));

                const ordersId = orders.data.map((x) => x.id);
                set(ordersKey, parsedOrders.filter((x) => ordersId.includes(x)));
              }
            });
        } else {
          remove(ordersKey);
        }
      } catch (_) {
        remove(ordersKey);
      }
    }
  };

  const addOrder = (id: number) => {
    const localOrdersIds = get(ordersKey);
    if (localOrdersIds) {
      const parsedOrders = JSON.parse(localOrdersIds);
      set(ordersKey, [...new Set([...parsedOrders, id])]);
    } else {
      set(ordersKey, [id]);
    }
  };

  const cancelOrder = async (id: number) => {
    changeStatus({ id, status: Statuses.Canceled })
      .then(() => getUserOrders());
  };

  const payOrder = async (id: number, table: null | number) => {
    payUserOrder({ id, orderTable: table })
      .then(() => getUserOrders());
  };

  useEffect(() => {
    window.addEventListener('storage', getUserOrders);
    getUserOrders();

    return () => window.removeEventListener('storage', getUserOrders);
  }, []);

  return {
    addOrder,
    cancelOrder,
    getUserOrders,
    payOrder
  };
};
