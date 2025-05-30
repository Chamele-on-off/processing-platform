class BalanceWidget {
  static init() {
    if (!document.getElementById('balanceWidget')) return;
    
    this.updateInterval = 30000; // 30 секунд
    this.socket = new WebSocket(`wss://${window.location.host}/ws/balance`);
    this.socket.onmessage = (event) => this.updateBalance(JSON.parse(event.data));
    
    this.loadInitialBalance();
    this.setupAutoRefresh();
  }

  static async loadInitialBalance() {
    try {
      const response = await fetch('/api/balance', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      this.updateBalance(data);
    } catch (error) {
      console.error('Balance load failed:', error);
    }
  }

  static updateBalance(data) {
    const widget = document.getElementById('balanceWidget');
    if (!widget) return;

    widget.innerHTML = `
      <div class="balance-card">
        <div class="balance-header">
          <span>Текущий баланс</span>
          <small>${new Date().toLocaleDateString('ru-RU')}</small>
        </div>
        <div class="balance-amount">${Utils.formatCurrency(data.current)}</div>
        <div class="balance-details">
          <div>
            <span>Доступно</span>
            <span>${Utils.formatCurrency(data.available)}</span>
          </div>
          <div>
            <span>В обработке</span>
            <span>${Utils.formatCurrency(data.pending)}</span>
          </div>
        </div>
      </div>
    `;
  }

  static setupAutoRefresh() {
    setInterval(() => this.loadInitialBalance(), this.updateInterval);
  }
}

document.addEventListener('DOMContentLoaded', () => BalanceWidget.init());
