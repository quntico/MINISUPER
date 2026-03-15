
import { useState, useCallback } from 'react';
import { addItemToCart, removeItemFromCart, updateItemQuantity, clearCart } from '@/utils/cartUtils.js';

export const useCart = (initialCart = []) => {
  const [cart, setCart] = useState(initialCart);

  const addItem = useCallback((product, quantity = 1) => {
    setCart(currentCart => addItemToCart(currentCart, product, quantity));
  }, []);

  const removeItem = useCallback((productId) => {
    setCart(currentCart => removeItemFromCart(currentCart, productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCart(currentCart => updateItemQuantity(currentCart, productId, quantity));
  }, []);

  const clear = useCallback(() => {
    setCart(clearCart());
  }, []);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    itemCount
  };
};
