
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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const formatNumber = (num: number, locale = 'es-MX'): string => {
  return new Intl.NumberFormat(locale).format(num);
};
