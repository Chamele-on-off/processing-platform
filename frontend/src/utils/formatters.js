export const formatDateTime = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

export const formatCurrency = (amount, currency = 'RUB') => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency
  }).format(amount);
};

export const formatTimeDifference = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
};
