
export const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const calculateTax = (subtotal, taxRate = 0.16) => {
  return subtotal * taxRate;
};

export const calculateTotal = (items, taxRate = 0.16) => {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, taxRate);
  return subtotal + tax;
};

export const addItemToCart = (cart, product, quantity = 1) => {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    return cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }
  
  return [...cart, { ...product, quantity }];
};

export const removeItemFromCart = (cart, productId) => {
  return cart.filter(item => item.id !== productId);
};

export const updateItemQuantity = (cart, productId, quantity) => {
  if (quantity <= 0) {
    return removeItemFromCart(cart, productId);
  }
  
  return cart.map(item =>
    item.id === productId
      ? { ...item, quantity }
      : item
  );
};

export const clearCart = () => {
  return [];
};
