
export const formatCurrency = (amount: number, currency = 'MXN', locale = 'es-MX'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString: string, locale = 'es-MX'): string => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString));
};

export const formatDateTime = (dateString: string, locale = 'es-MX'): string => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const re = /^\+?[\d\s-]{10,15}$/;
  return re.test(phone);
};

export const getFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return defaultValue;
  }
};

export const setToLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage', error);
  }
};
