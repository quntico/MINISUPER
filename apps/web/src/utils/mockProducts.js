
export const mockProducts = [
  {
    id: 'prod-001',
    name: 'Coca-Cola 500ml',
    category: 'Bebidas',
    price: 2.50,
    barcode: '7501055300013',
    stock: 48,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&h=200&fit=crop'
  },
  {
    id: 'prod-002',
    name: 'Pan Blanco Bimbo',
    category: 'Panadería',
    price: 3.75,
    barcode: '7501000100019',
    stock: 24,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop'
  },
  {
    id: 'prod-003',
    name: 'Leche Lala 1L',
    category: 'Lácteos',
    price: 4.20,
    barcode: '7501055300020',
    stock: 36,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop'
  },
  {
    id: 'prod-004',
    name: 'Huevos San Juan 12pz',
    category: 'Lácteos',
    price: 5.80,
    barcode: '7501055300037',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop'
  },
  {
    id: 'prod-005',
    name: 'Arroz Verde Valle 1kg',
    category: 'Abarrotes',
    price: 6.50,
    barcode: '7501055300044',
    stock: 42,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop'
  },
  {
    id: 'prod-006',
    name: 'Frijoles La Costeña 560g',
    category: 'Abarrotes',
    price: 4.90,
    barcode: '7501055300051',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=200&h=200&fit=crop'
  },
  {
    id: 'prod-007',
    name: 'Aceite Capullo 1L',
    category: 'Abarrotes',
    price: 8.25,
    barcode: '7501055300068',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop'
  },
  {
    id: 'prod-008',
    name: 'Papel Higiénico Pétalo 4pz',
    category: 'Limpieza',
    price: 7.30,
    barcode: '7501055300075',
    stock: 27,
    image: 'https://images.unsplash.com/photo-1584556326561-c8746083993b?w=200&h=200&fit=crop'
  },
  {
    id: 'prod-009',
    name: 'Jabón Zote 200g',
    category: 'Limpieza',
    price: 2.80,
    barcode: '7501055300082',
    stock: 54,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=200&h=200&fit=crop'
  },
  {
    id: 'prod-010',
    name: 'Sabritas Original 45g',
    category: 'Botanas',
    price: 3.20,
    barcode: '7501055300099',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop'
  },
  {
    id: 'prod-011',
    name: 'Galletas Marías Gamesa',
    category: 'Botanas',
    price: 4.50,
    barcode: '7501055300105',
    stock: 33,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop'
  },
  {
    id: 'prod-012',
    name: 'Atún Dolores 140g',
    category: 'Abarrotes',
    price: 5.60,
    barcode: '7501055300112',
    stock: 21,
    image: 'https://images.unsplash.com/photo-1580217593608-61931cefc821?w=200&h=200&fit=crop'
  }
];

export const getProductByBarcode = (barcode) => {
  return mockProducts.find(p => p.barcode === barcode);
};

export const getProductById = (id) => {
  return mockProducts.find(p => p.id === id);
};

export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.barcode.includes(query)
  );
};

export const getProductsByCategory = (category) => {
  if (!category || category === 'Todos') return mockProducts;
  return mockProducts.filter(p => p.category === category);
};
