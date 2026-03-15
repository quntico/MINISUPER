
export const categories = [
  'Bebidas', 'Panadería', 'Lácteos', 'Snacks', 'Dulces', 
  'Enlatados', 'Abarrotes', 'Congelados', 'Higiene', 'Otros'
];

export const providers = [
  'Coca-Cola FEMSA', 'Grupo Bimbo', 'Grupo Lala', 'PepsiCo', 
  'Nestlé', 'Procter & Gamble', 'Unilever', 'Distribuidora Local'
];

export const mockProducts = [
  {
    id: '1',
    sku: 'BEB-001',
    name: 'Coca-Cola Original 600ml',
    description: 'Refresco de cola original en botella de PET de 600ml.',
    category: 'Bebidas',
    barcode: '7501055300075',
    cost: 12.50,
    price: 18.00,
    tax: 16,
    stock: 145,
    status: 'Activo',
    provider: 'Coca-Cola FEMSA',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80'
  },
  {
    id: '2',
    sku: 'PAN-001',
    name: 'Pan Blanco Bimbo Grande',
    description: 'Pan de caja blanco enriquecido con vitaminas.',
    category: 'Panadería',
    barcode: '7501000111201',
    cost: 32.00,
    price: 45.00,
    tax: 0,
    stock: 24,
    status: 'Activo',
    provider: 'Grupo Bimbo',
    image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=500&q=80'
  },
  {
    id: '3',
    sku: 'LAC-001',
    name: 'Leche Lala Entera 1L',
    description: 'Leche entera pasteurizada adicionada con vitaminas A y D.',
    category: 'Lácteos',
    barcode: '7501020510935',
    cost: 20.50,
    price: 26.00,
    tax: 0,
    stock: 60,
    status: 'Activo',
    provider: 'Grupo Lala',
    image: 'https://images.unsplash.com/photo-1563636619276-2087596990a2?w=500&q=80'
  },
  {
    id: '4',
    sku: 'SNA-001',
    name: 'Sabritas Sal 40g',
    description: 'Papas fritas clásicas con sal.',
    category: 'Snacks',
    barcode: '7501011131064',
    cost: 10.00,
    price: 16.00,
    tax: 8,
    stock: 85,
    status: 'Activo',
    provider: 'PepsiCo',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&q=80'
  },
  {
    id: '5',
    sku: 'ABA-001',
    name: 'Aceite Nutrioli 845ml',
    description: 'Aceite vegetal comestible puro de soya.',
    category: 'Abarrotes',
    barcode: '7501058617347',
    cost: 35.00,
    price: 48.00,
    tax: 0,
    stock: 30,
    status: 'Activo',
    provider: 'Distribuidora Local',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80'
  },
  {
    id: '6',
    sku: 'HIG-001',
    name: 'Papel Higiénico Pétalo 4 Rollos',
    description: 'Papel higiénico hoja doble, suave y resistente.',
    category: 'Higiene',
    barcode: '7501035905832',
    cost: 22.00,
    price: 32.00,
    tax: 16,
    stock: 40,
    status: 'Activo',
    provider: 'Distribuidora Local',
    image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=500&q=80'
  },
  {
    id: '7',
    sku: 'ENL-001',
    name: 'Atún Dolores en Agua 140g',
    description: 'Atún aleta amarilla en agua.',
    category: 'Enlatados',
    barcode: '7501045401188',
    cost: 15.50,
    price: 21.00,
    tax: 0,
    stock: 110,
    status: 'Activo',
    provider: 'Distribuidora Local',
    image: 'https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=500&q=80'
  },
  {
    id: '8',
    sku: 'BEB-002',
    name: 'Jugo Jumex Manzana 1L',
    description: 'Néctar de manzana clarificado.',
    category: 'Bebidas',
    barcode: '7501013100150',
    cost: 18.00,
    price: 25.00,
    tax: 0,
    stock: 0,
    status: 'Inactivo',
    provider: 'Distribuidora Local',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80'
  },
  {
    id: '9',
    sku: 'DUL-001',
    name: 'Chocolate Carlos V 20g',
    description: 'Chocolate con leche estilo suizo.',
    category: 'Dulces',
    barcode: '7501058617348',
    cost: 6.50,
    price: 10.00,
    tax: 8,
    stock: 200,
    status: 'Activo',
    provider: 'Nestlé',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&q=80'
  },
  {
    id: '10',
    sku: 'SNA-002',
    name: 'Doritos Nacho 58g',
    description: 'Totopos de maíz sabor queso y chile.',
    category: 'Snacks',
    barcode: '7501011131065',
    cost: 12.00,
    price: 18.00,
    tax: 8,
    stock: 5,
    status: 'Descontinuado',
    provider: 'PepsiCo',
    image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=500&q=80'
  }
];

export const getProducts = () => [...mockProducts];
export const getProductById = (id) => mockProducts.find(p => p.id === id);
export const getCategories = () => [...categories];
export const getProviders = () => [...providers];

export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) || 
    p.sku.toLowerCase().includes(lowerQuery) || 
    (p.barcode && p.barcode.includes(lowerQuery))
  );
};

export const filterProducts = (products, filters) => {
  return products.filter(p => {
    if (filters.category && filters.category !== 'Todas' && p.category !== filters.category) return false;
    if (filters.status && filters.status !== 'Todos' && p.status !== filters.status) return false;
    if (filters.minPrice && p.price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > parseFloat(filters.maxPrice)) return false;
    return true;
  });
};
