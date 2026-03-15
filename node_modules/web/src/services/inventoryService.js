
import pb from '@/lib/pocketbase.js';

export const updateStock = async (productId, quantity) => {
  try {
    const product = await pb.collection('products').getOne(productId, {
      $autoCancel: false,
    });
    
    // If quantity is negative, we are deducting stock
    const deductAmount = quantity < 0 ? Math.abs(quantity) : -quantity;
    
    if (quantity < 0 && product.stock < deductAmount) {
      console.error(`Insufficient stock for product ${productId}`);
      return false;
    }
    
    const newStock = product.stock + quantity; // quantity is negative for deductions
    
    await pb.collection('products').update(productId, {
      stock: newStock
    }, {
      $autoCancel: false,
    });
    
    return true;
  } catch (error) {
    console.error(`Error updating stock for product ${productId}:`, error);
    return false;
  }
};

export const checkStock = async (productId, requestedQuantity) => {
  try {
    const product = await pb.collection('products').getOne(productId, {
      $autoCancel: false,
    });
    
    return product.stock >= requestedQuantity;
  } catch (error) {
    console.error(`Error checking stock for product ${productId}:`, error);
    return false;
  }
};

export const getLowStockProducts = async (threshold = 5) => {
  try {
    return await pb.collection('products').getFullList({
      filter: `stock <= ${threshold} && active = true`,
      sort: 'stock',
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    throw error;
  }
};

export const getInventoryValue = async () => {
  try {
    const products = await pb.collection('products').getFullList({
      filter: 'active = true',
      $autoCancel: false,
    });
    
    return products.reduce((total, product) => {
      return total + (product.stock * product.price);
    }, 0);
  } catch (error) {
    console.error('Error calculating inventory value:', error);
    throw error;
  }
};
