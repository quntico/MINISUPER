
export const formatCurrency = (amount, currency = 'MXN', locale = 'es-MX') => {
  if (amount === undefined || amount === null) return '';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString, locale = 'es-MX') => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString));
};

export const formatDateTime = (dateString, locale = 'es-MX') => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const formatNumber = (num, locale = 'es-MX') => {
  if (num === undefined || num === null) return '';
  return new Intl.NumberFormat(locale).format(num);
};

export const formatPercent = (value, total) => {
  if (!total || total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhone = (phone) => {
  const re = /^\+?[\d\s-]{10,15}$/;
  return re.test(phone);
};

export const isValidPassword = (password) => {
  return password && password.length >= 8;
};

export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return defaultValue;
  }
};

export const setToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage', error);
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
};

export const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterBy = (array, key, value) => {
  return array.filter(item => item[key] === value);
};

export const findBy = (array, key, value) => {
  return array.find(item => item[key] === value);
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncate = (str, length) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const getTimeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
};

export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
