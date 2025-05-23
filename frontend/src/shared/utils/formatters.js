export const formatDate = (dateString, options = {}) => {
  const defaultOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleString('ru-RU', {
    ...defaultOptions,
    ...options
  });
};

export const formatCurrency = (amount, currency = 'RUB') => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength 
    ? `${text.substring(0, maxLength)}...` 
    : text;
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
};
