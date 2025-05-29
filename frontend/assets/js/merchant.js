/**
 * Модуль для панели мерчанта
 */

class MerchantDashboard {
    constructor() {
        this.loadDashboardData();
        this.loadRecentTransactions();
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('refresh-balance').addEventListener('click', this.loadDashboardData.bind(this));
        document.getElementById('refresh-transactions').addEventListener('click', this.loadRecentTransactions.bind(this));
        document.getElementById('request-withdrawal').addEventListener('click', this.showWithdrawalModal.bind(this));
        document.getElementById('submit-withdrawal').addEventListener('click', this.requestWithdrawal.bind(this));
    }

    async loadDashboardData() {
        try {
            const data = await platform.makeRequest('/merchant/dashboard');
            
            // Обновляем информацию о балансе
            document.getElementById('available-balance').textContent = platform.formatCurrency(data.availableBalance);
            document.getElementById('pending-balance').textContent = platform.formatCurrency(data.pendingBalance);
            document.getElementById('total-earnings').textContent = platform.formatCurrency(data.totalEarnings);
            
            // Обновляем график баланса
            this.updateBalanceChart(data.balanceHistory);
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            platform.showError('Ошибка загрузки данных');
        }
    }

    async loadRecentTransactions() {
        try {
            const transactions = await platform.makeRequest('/merchant/transactions/recent');
            const tbody = document.getElementById('recent-transactions');
            tbody.innerHTML = '';
            
            transactions.forEach(tx => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${tx.id}</td>
                    <td>${platform.formatCurrency(tx.amount, tx.currency)}</td>
                    <td>${this.getTypeText(tx.type)}</td>
                    <td><span class="badge bg-${this.getStatusBadgeClass(tx.status)}">${this.getStatusText(tx.status)}</span></td>
                    <td>${platform.formatDate(tx.createdAt)}</td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Failed to load transactions:', error);
            platform.showError('Ошибка загрузки транзакций');
        }
    }

    getTypeText(type) {
        switch (type) {
            case 'deposit': return 'Депозит';
            case 'withdrawal': return 'Вывод';
            default: return type;
        }
    }

    getStatusBadgeClass(status) {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'danger';
            default: return 'secondary';
        }
    }

    getStatusText(status) {
        switch (status) {
            case 'completed': return 'Завершено';
            case 'pending': return 'В обработке';
            case 'failed': return 'Ошибка';
            default: return status;
        }
    }

    updateBalanceChart(data) {
        // Здесь должна быть реализация обновления графика баланса
        console.log('Update balance chart with data:', data);
    }

    showWithdrawalModal() {
        const modal = new bootstrap.Modal(document.getElementById('withdrawalModal'));
        modal.show();
    }

    async requestWithdrawal() {
        const amount = document.getElementById('withdrawal-amount').value;
        const currency = document.getElementById('withdrawal-currency').value;
        const method = document.getElementById('withdrawal-method').value;
        const details = document.getElementById('withdrawal-details').value;
        
        try {
            const response = await platform.makeRequest('/merchant/withdrawals', 'POST', {
                amount: parseFloat(amount),
                currency,
                method,
                details
            });
            
            platform.showSuccess('Запрос на вывод средств отправлен');
            this.loadDashboardData();
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('withdrawalModal'));
            modal.hide();
        } catch (error) {
            console.error('Failed to request withdrawal:', error);
            platform.showError('Ошибка запроса вывода средств');
        }
    }
}

// Инициализация панели мерчанта при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.merchant-dashboard')) {
        new MerchantDashboard();
    }
});
