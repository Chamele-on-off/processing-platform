class TransactionMatcher {
  static init() {
    this.setupWebSocket();
    this.loadInitialData();
    this.setupEventListeners();
  }

  static setupWebSocket() {
    this.socket = new WebSocket(`wss://${window.location.host}/ws/matching`);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_match') {
        this.addPendingMatch(data.match);
        NotificationCenter.showNotification({
          title: 'Найдено совпадение',
          message: `Депозит #${data.match.depositId} ↔ Выплата #${data.match.payoutId}`,
          type: 'info'
        });
      }
    };
  }

  static async loadInitialData() {
    try {
      const [pending, stats] = await Promise.all([
        fetch('/api/matching/pending').then(r => r.json()),
        fetch('/api/matching/stats').then(r => r.json())
      ]);

      this.updateStats(stats);
      pending.forEach(match => this.addPendingMatch(match));
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  }

  static setupEventListeners() {
    // Переключение табов
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
    document.getElementById('refreshMatching').addEventListener('click', () => {
      this.loadInitialData();
    });

    // Переключение авто-матчинга
    document.getElementById('autoMatchingToggle').addEventListener('change', (e) => {
      fetch('/api/matching/toggle-auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ enabled: e.target.checked })
      });
    });
  }

  static addPendingMatch(match) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${match.id}</td>
      <td>
        <a href="/admin/transactions/${match.depositId}" target="_blank">
          #${match.depositId}
        </a>
      </td>
      <td>
        <a href="/admin/transactions/${match.payoutId}" target="_blank">
          #${match.payoutId}
        </a>
      </td>
      <td>${Utils.formatCurrency(match.amount)}</td>
      <td>${Utils.formatDate(match.createdAt)}</td>
      <td class="actions">
        <button class="btn-sm confirm" data-match-id="${match.id}">Подтвердить</button>
        <button class="btn-sm reject" data-match-id="${match.id}">Отклонить</button>
      </td>
    `;

    row.querySelector('.confirm').addEventListener('click', () => this.confirmMatch(match.id));
    row.querySelector('.reject').addEventListener('click', () => this.rejectMatch(match.id));

    document.getElementById('pendingMatches').prepend(row);
  }

  static async confirmMatch(matchId) {
    try {
      const response = await fetch(`/api/matching/${matchId}/confirm`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        document.querySelector(`tr td:first-child:contains("${matchId}")`).closest('tr').remove();
        NotificationCenter.showNotification({
          title: 'Матчинг подтверждён',
          message: 'Транзакции успешно связаны',
          type: 'success'
        });
        this.loadInitialData(); // Обновляем статистику
      }
    } catch (error) {
      console.error('Confirm failed:', error);
    }
  }

  static async rejectMatch(matchId) {
    // Аналогично confirmMatch, но с другим endpoint
  }

  static updateStats(stats) {
    document.getElementById('matchedCount').textContent = stats.todayMatches;
    document.getElementById('savedAmount').textContent = Utils.formatCurrency(stats.savedAmount);
  }
}

document.addEventListener('DOMContentLoaded', () => TransactionMatcher.init());
