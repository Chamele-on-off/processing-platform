class TriangleTransactions {
  static init() {
    this.setupWebSocket();
    this.loadInitialData();
    this.setupEventListeners();
  }

  static setupWebSocket() {
    this.socket = new WebSocket(`wss://${window.location.host}/ws/triangle`);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_triangle') {
        this.addTriangleTransaction(data.transaction);
        this.updateStats(data.stats);
      }
    };
  }

  static async loadInitialData() {
    try {
      const [transactions, stats] = await Promise.all([
        fetch('/api/triangle/transactions').then(r => r.json()),
        fetch('/api/triangle/stats').then(r => r.json())
      ]);

      this.renderTransactions(transactions);
      this.updateStats(stats);
    } catch (error) {
      console.error('Failed to load triangle data:', error);
    }
  }

  static setupEventListeners() {
    // Табы
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
          el.classList.remove('active');
        });
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}Tab`).classList.add('active');
      });
    });

    // Кнопка обновления
    document.getElementById('refreshTriangle').addEventListener('click', () => {
      this.loadInitialData();
    });

    // Поиск
    document.getElementById('triangleSearch').addEventListener('input', Utils.debounce(() => {
      this.searchTransactions();
    }, 300));
  }

  static renderTransactions(transactions) {
    const tbody = document.getElementById('triangleTransactions');
    tbody.innerHTML = transactions.map(tx => `
      <tr>
        <td>${tx.id}</td>
        <td>
          ${tx.deposits.map(d => `
            <div class="deposit-item">
              <a href="/admin/transactions/${d.id}" target="_blank">#${d.id}</a>
              <span>${Utils.formatCurrency(d.amount)}</span>
            </div>
          `).join('')}
        </td>
        <td>
          <a href="/admin/transactions/${tx.payout.id}" target="_blank">
            #${tx.payout.id}
          </a>
        </td>
        <td>${Utils.formatCurrency(tx.amount)}</td>
        <td>
          <span class="status-badge ${tx.status}">${this.getStatusText(tx.status)}</span>
        </td>
        <td>
          ${tx.status === 'pending' ? `
            <button class="btn-sm confirm" data-tx-id="${tx.id}">Подтвердить</button>
            <button class="btn-sm cancel" data-tx-id="${tx.id}">Отменить</button>
          ` : ''}
        </td>
      </tr>
    `).join('');

    // Добавляем обработчики для кнопок
    document.querySelectorAll('.confirm').forEach(btn => {
      btn.addEventListener('click', (e) => this.confirmTransaction(e.target.dataset.txId));
    });
    
    document.querySelectorAll('.cancel').forEach(btn => {
      btn.addEventListener('click', (e) => this.cancelTransaction(e.target.dataset.txId));
    });
  }

  static addTriangleTransaction(transaction) {
    const tbody = document.getElementById('triangleTransactions');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${transaction.id}</td>
      <td>
        ${transaction.deposits.map(d => `
          <div class="deposit-item">
            <a href="/admin/transactions/${d.id}" target="_blank">#${d.id}</a>
            <span>${Utils.formatCurrency(d.amount)}</span>
          </div>
        `).join('')}
      </td>
      <td>
        <a href="/admin/transactions/${transaction.payout.id}" target="_blank">
          #${transaction.payout.id}
        </a>
      </td>
      <td>${Utils.formatCurrency(transaction.amount)}</td>
      <td>
        <span class="status-badge ${transaction.status}">${this.getStatusText(transaction.status)}</span>
      </td>
      <td>
        <button class="btn-sm confirm" data-tx-id="${transaction.id}">Подтвердить</button>
        <button class="btn-sm cancel" data-tx-id="${transaction.id}">Отменить</button>
      </td>
    `;
    tbody.prepend(row);
  }

  static async confirmTransaction(txId) {
    try {
      const response = await fetch(`/api/triangle/${txId}/confirm`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        this.loadInitialData();
        NotificationCenter.showNotification({
          title: 'Транзакция подтверждена',
          message: 'Треугольная транзакция успешно завершена',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Confirm failed:', error);
    }
  }

  static async cancelTransaction(txId) {
    // Аналогично confirmTransaction
  }

  static updateStats(stats) {
    document.getElementById('triangleEfficiency').textContent = `${stats.efficiency}%`;
    document.getElementById('triangleVolume').textContent = Utils.formatCurrency(stats.volume);
  }

  static getStatusText(status) {
    const statuses = {
      'pending': 'На проверке',
      'completed': 'Завершено',
      'failed': 'Ошибка',
      'canceled': 'Отменено'
    };
    return statuses[status] || status;
  }

  static async searchTransactions() {
    const query = document.getElementById('triangleSearch').value;
    if (query.length < 2) return;

    try {
      const response = await fetch(`/api/triangle/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      this.renderTransactions(data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => TriangleTransactions.init());
