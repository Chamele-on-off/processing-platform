export const ROLES = {
  ADMIN: 'admin',
  TRADER: 'trader',
  MERCHANT: 'merchant'
};

export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_USERS: 'manage_users',
  PROCESS_TRANSACTIONS: 'process_transactions',
  VIEW_REPORTS: 'view_reports',
  MANAGE_SETTINGS: 'manage_settings'
};

export const TRANSACTION_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

export const PAYMENT_METHODS = {
  SBP: 'sbp',
  CARD: 'card',
  QR: 'qr',
  CRYPTO: 'crypto'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/me'
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    CREATE: '/transactions',
    DETAIL: (id) => `/transactions/${id}`
  }
};
