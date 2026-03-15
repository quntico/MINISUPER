
export const categories = [
  { id: 'all', name: 'Todos', icon: 'Grid3x3' },
  { id: 'bebidas', name: 'Bebidas', icon: 'Coffee' },
  { id: 'panaderia', name: 'Panadería', icon: 'Croissant' },
  { id: 'lacteos', name: 'Lácteos', icon: 'Milk' },
  { id: 'abarrotes', name: 'Abarrotes', icon: 'ShoppingBasket' },
  { id: 'limpieza', name: 'Limpieza', icon: 'Sparkles' },
  { id: 'botanas', name: 'Botanas', icon: 'Cookie' }
];

export const getCategoryById = (id) => {
  return categories.find(c => c.id === id);
};

export const getCategoryName = (id) => {
  const category = getCategoryById(id);
  return category ? category.name : 'Todos';
};
