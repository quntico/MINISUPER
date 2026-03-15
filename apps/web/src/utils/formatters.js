
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('es-MX').format(number);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

export const formatTime = (date) => {
  return new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};
