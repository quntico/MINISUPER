
import pb from '@/lib/pocketbase.js';

const formatDateForPB = (date, endOfDay = false) => {
  const d = new Date(date);
  if (endOfDay) {
    d.setHours(23, 59, 59, 999);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  return d.toISOString().replace('T', ' ');
};

export const getTopProducts = async (limit = 10, startDate, endDate) => {
  try {
    let filter = '';
    if (startDate && endDate) {
      const startStr = formatDateForPB(startDate);
      const endStr = formatDateForPB(endDate, true);
      filter = `created >= "${startStr}" && created <= "${endStr}"`;
    }

    const saleItems = await pb.collection('sale_items').getFullList({
      filter,
      $autoCancel: false,
    });

    const productCounts = {};
    saleItems.forEach(item => {
      if (!productCounts[item.product_id]) {
        productCounts[item.product_id] = {
          id: item.product_id,
          name: item.product_name,
          quantity: 0,
          revenue: 0
        };
      }
      productCounts[item.product_id].quantity += item.quantity;
      productCounts[item.product_id].revenue += item.line_total;
    });

    return Object.values(productCounts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching top products:', error);
    return [];
  }
};

export const getTopProductsByRevenue = async (limit = 10, startDate, endDate) => {
  const products = await getTopProducts(1000, startDate, endDate);
  return products.sort((a, b) => b.revenue - a.revenue).slice(0, limit);
};

export const getProductsByCategory = async (category, startDate, endDate) => {
  try {
    const products = await pb.collection('products').getFullList({
      filter: `category = "${category}"`,
      $autoCancel: false,
    });
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

export const getLowRotationProducts = async (threshold = 5) => {
  // Simplified: products with high stock but low sales recently
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const topProducts = await getTopProducts(1000, thirtyDaysAgo, new Date());
    const soldProductIds = new Set(topProducts.filter(p => p.quantity > threshold).map(p => p.id));
    
    const allProducts = await pb.collection('products').getFullList({
      filter: 'active = true && stock > 0',
      $autoCancel: false,
    });
    
    return allProducts.filter(p => !soldProductIds.has(p.id));
  } catch (error) {
    console.error('Error fetching low rotation products:', error);
    return [];
  }
};

export const getProductsWithoutMovement = async (days = 30) => {
  return getLowRotationProducts(0);
};
