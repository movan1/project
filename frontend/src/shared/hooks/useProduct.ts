import { useEffect } from 'react';

import { handleSetCart } from '@entities/cart';

import { useLocalStorage } from '@shared/hooks';
import { useAppDispatch } from '@shared/lib';

const cartKey = 'cart';

export const useProduct = () => {
  const {
    get, remove, set
  } = useLocalStorage();
  const dispatch = useAppDispatch();

  const handleSetCartInStore = (x: number[]) => {
    dispatch(handleSetCart(x));
  };

  const clearCart = () => {
    remove(cartKey);
    handleSetCartInStore([]);
  };

  const addProduct = (id: number) => {
    const localCart = get(cartKey);

    if (localCart) {
      try {
        const parsedCart = JSON.parse(localCart);
        if (
          Array.isArray(parsedCart)
          && parsedCart.every((x) => typeof x === 'number')
        ) {
          if (!parsedCart.includes(id)) {
            parsedCart.push(id);
            set(cartKey, parsedCart);
            handleSetCartInStore(parsedCart);
          }
        }
      } catch (_) {
        set(cartKey, [id]);
        handleSetCartInStore([id]);
      }
    } else {
      set(cartKey, [id]);
      handleSetCartInStore([id]);
    }
  };

  const removeProduct = (id: number) => {
    const localCart = get(cartKey);

    if (localCart) {
      try {
        const parsedCart = JSON.parse(localCart);
        if (
          Array.isArray(parsedCart)
          && parsedCart.every((x) => typeof x === 'number')
        ) {
          if (parsedCart.includes(id)) {
            const newCart = parsedCart.filter((x) => x !== id);
            set(cartKey, newCart);
            handleSetCartInStore(newCart);
          }
        } else {
          clearCart();
        }
      } catch (_) {
        clearCart();
      }
    } else {
      clearCart();
    }
  };

  const fillCart = () => {
    const localCart = get(cartKey);

    if (localCart) {
      try {
        const parsedCart = JSON.parse(localCart);
        if (
          Array.isArray(parsedCart)
          && parsedCart.every((x) => typeof x === 'number')
        ) {
          handleSetCartInStore(parsedCart);
        } else {
          remove(cartKey);
        }
      } catch (_) {
        remove(cartKey);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('storage', fillCart);
    fillCart();

    return () => window.removeEventListener('storage', fillCart);
  }, []);

  return {
    addProduct,
    clearCart,
    removeProduct
  };
};
