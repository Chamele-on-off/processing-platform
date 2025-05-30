class Utils {
  static formatCurrency(amount, currency = '₽') {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ' + currency;
  }

  static formatDate(dateString) {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('ru-RU', options);
  }

  static debounce(func, delay = 300) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  static async checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login.html';
      return false;
    }
    
    try {
      const response = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.ok;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }

  static handleAPIError(error) {
    console.error('API Error:', error);
    if (error.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    }
    // Можно добавить другие обработчики ошибок
  }
}

// Вспомогательные функции для работы с DOM
const DOM = {
  toggleLoader(show = true) {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.style.display = show ? 'flex' : 'none';
  },

  setActiveNavItem(path) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === path);
    });
  }
};
