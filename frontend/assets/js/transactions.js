class TransactionHandler {
  static BASE_URL = '/api/transactions';

  static async getTransactions(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${this.BASE_URL}?${query}`);
    return response.json();
  }

  static async createTransaction(data) {
    const response = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  static async updateTransaction(id, data) {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  static async matchTransactions(depositId, payoutId) {
    const response = await fetch(`${this.BASE_URL}/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ depositId, payoutId })
    });
    return response.json();
  }
}

// Инициализация таблицы транзакций
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('transactionsTable')) {
    TransactionHandler.getTransactions()
      .then(data => {
        const tableBody = document.querySelector('#transactionsTable tbody');
        tableBody.innerHTML = data.map(tx => `
          <tr>
            <td>${tx.id}</td>
            <td>${tx.amount} ₽</td>
            <td>${tx.type}</td>
            <td>${tx.status}</td>
            <td>${new Date(tx.createdAt).toLocaleString()}</td>
          </tr>
        `).join('');
      });
  }
});
