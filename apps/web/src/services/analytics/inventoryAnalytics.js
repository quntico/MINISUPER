
import pb from '@/lib/pocketbase.js';

export const getLowStockProducts = async (threshold = 5) => {
  try {
    return await pb.collection('products').getFullList({
      filter: `stock <= ${threshold} && stock > 0 && active = true`,
      sort: 'stock',
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return [];
  }
};

export const getOutOfStockProducts = async () => {
  try {
    return await pb.collection('products').getFullList({
      filter: `stock <= 0 && active = true`,
      sort: 'name',
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error fetching out of stock products:', error);
    return [];
  }
};

export const getInventoryValue = async () => {
  try {
    const products = await pb.collection('products').getFullList({
      filter: 'active = true && stock > 0',
      $autoCancel: false,
    });
    
    let totalCost = 0;
    let totalPrice = 0;
    
    products.forEach(p => {
      totalCost += (p.cost || 0) * p.stock;
      totalPrice += (p.price || 0) * p.stock;
    });
    
    return { totalCost, totalPrice };
  } catch (error) {
    console.error('Error calculating inventory value:', error);
    return { totalCost: 0, totalPrice: 0 };
  }
};

export const getInventoryByCategory = async () => {
  try {
    const products = await pb.collection('products').getFullList({
      filter: 'active = true',
      $autoCancel: false,
    });
    
    const categories = {};
    products.forEach(p => {
      if (!categories[p.category]) {
        categories[p.category] = { count: 0, value: 0, stock: 0 };
      }
      categories[p.category].count += 1;
      categories[p.category].stock += p.stock;
      categories[p.category].value += (p.price * p.stock);
    });
    
    return Object.entries(categories).map(([name, data]) => ({
      name,
      ...data
    }));
  } catch (error) {
    console.error('Error fetching inventory by category:', error);
    return [];
  }
};

export const getInventoryStatus = async () => {
  try {
    const products = await pb.collection('products').getFullList({
      filter: 'active = true',
      $autoCancel: false,
    });
    
    const totalProducts = products.length;
    const outOfStock = products.filter(p => p.stock <= 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const inStock = totalProducts - outOfStock - lowStock;
    
    return { totalProducts, inStock, lowStock, outOfStock };
  } catch (error) {
    console.error('Error fetching inventory status:', error);
    return { totalProducts: 0, inStock: 0, lowStock: 0, outOfStock: 0 };
  }
};
