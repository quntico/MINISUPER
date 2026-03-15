
import pb from '@/lib/pocketbase.js';

export const generateFolio = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `VTA-${yyyy}${mm}${dd}-${randomStr}`;
};

export const createSale = async (saleData) => {
  try {
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error("User must be authenticated to create a sale");

    const data = {
      folio: generateFolio(),
      subtotal: saleData.subtotal,
      tax_total: saleData.tax,
      total: saleData.total,
      payment_method: saleData.payment_method,
      cashier: saleData.cashier || pb.authStore.model?.name || 'Cajero',
      status: saleData.status || 'completed',
      user_id: userId,
    };

    const record = await pb.collection('sales').create(data, {
      $autoCancel: false,
    });
    
    return record.id;
  } catch (error) {
    console.error('Error creating sale:', error);
    throw error;
  }
};

export const createSaleItems = async (saleId, items) => {
  try {
    const promises = items.map(item => {
      return pb.collection('sale_items').create({
        sale_id: saleId,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        discount: item.discount || 0,
        line_total: (item.quantity * item.price) - (item.discount || 0),
      }, {
        $autoCancel: false,
      });
    });
    
    const records = await Promise.all(promises);
    return records.map(r => r.id);
  } catch (error) {
    console.error('Error creating sale items:', error);
    throw error;
  }
};

export const getSaleById = async (id) => {
  try {
    return await pb.collection('sales').getOne(id, {
      expand: 'sale_items(sale_id)',
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error fetching sale:', error);
    throw error;
  }
};

export const getAllSales = async () => {
  try {
    return await pb.collection('sales').getFullList({
      sort: '-created',
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error fetching all sales:', error);
    throw error;
  }
};

export const getSalesByDateRange = async (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const startStr = start.toISOString().replace('T', ' ');
    const endStr = end.toISOString().replace('T', ' ');

    return await pb.collection('sales').getFullList({
      filter: `created >= "${startStr}" && created <= "${endStr}"`,
      sort: '-created',
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error fetching sales by date range:', error);
    throw error;
  }
};

export const cancelSale = async (id) => {
  try {
    return await pb.collection('sales').update(id, {
      status: 'cancelled'
    }, {
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error cancelling sale:', error);
    throw error;
  }
};
