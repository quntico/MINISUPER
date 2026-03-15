
import pb from '@/lib/pocketbase.js';

export const getProducts = async () => {
  try {
    return await pb.collection('products').getFullList({
      filter: 'active = true',
      sort: 'name',
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    return await pb.collection('products').getFullList({
      filter: `active = true && category = "${category}"`,
      sort: 'name',
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    return await pb.collection('products').getFullList({
      filter: `active = true && (name ~ "${query}" || sku ~ "${query}" || barcode ~ "${query}")`,
      sort: 'name',
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    return await pb.collection('products').getOne(id, {
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error fetching product by id:', error);
    throw error;
  }
};

export const createProduct = async (data) => {
  try {
    return await pb.collection('products').create(data, {
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  try {
    return await pb.collection('products').update(id, data, {
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    return await pb.collection('products').delete(id, {
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getProductsByIds = async (ids) => {
  if (!ids || ids.length === 0) return [];
  try {
    const filterString = ids.map(id => `id="${id}"`).join(' || ');
    return await pb.collection('products').getFullList({
      filter: filterString,
      $autoCancel: false,
    });
  } catch (error) {
    console.error('Error fetching products by ids:', error);
    throw error;
  }
};
