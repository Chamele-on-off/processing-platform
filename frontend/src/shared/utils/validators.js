export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validatePhone = (phone) => {
  const re = /^[\d\+][\d\s\-\(\)]{9,}$/;
  return re.test(phone);
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const validateFile = (file, options = {}) => {
  const { maxSize = 5, allowedTypes = [] } = options;
  
  if (!file) return false;
  if (file.size > maxSize * 1024 * 1024) return false;
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) return false;
  
  return true;
};
