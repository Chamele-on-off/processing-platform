/**
 * Модуль для админ-панели
 */

class AdminDashboard {
    constructor() {
        this.initCharts();
        this.loadStats();
        this.loadRecentTransactions();
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('refresh-stats').addEventListener('click', this.loadStats.bind(this));
        document.getElementById('refresh-transactions').addEventListener('click', this.loadRecentTransactions.bind(this));
    }

    async loadStats() {
        try {
            const stats = await platform.makeRequest('/admin/stats');
            
            // Обновляем карточки статистики
            document.getElementById('total-users').textContent = stats.totalUsers;
            document.getElementById('today-transactions').textContent = stats.todayTransactions;
            document.getElementById('active-traders').textContent = stats.activeTraders;
            document.getElementById('avg-processing-time').textContent = `${stats.avgProcessingTime} мин`;
            
            // Обновляем график активности
            this.updateActivityChart(stats.activityData);
            
            platform.showSuccess('Статистика обновлена');
        } catch (error) {
            console.error('Failed to load stats:', error);
            platform.showError('Ошибка загрузки статистики');
        }
    }

    async loadRecentTransactions() {
        try {
            const transactions = await platform.makeRequest('/admin/transactions/recent');
            const tbody = document.getElementById('recent-transactions');
            tbody.innerHTML = '';
            
            transactions.forEach(tx => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${tx.id}</td>
                    <td>${tx.merchantName}</td>
                    <td>${platform.formatCurrency(tx.amount, tx.currency)}</td>
                    <td><span class="badge bg-${this.getStatusBadgeClass(tx.status)}">${this.getStatusText(tx.status)}</span></td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Failed to load transactions:', error);
            platform.showError('Ошибка загрузки транзакций');
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

    initCharts() {
        // График активности
        const activityCtx = document.getElementById('activityChart');
        this.activityChart = new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Транзакции',
                    data: [],
                    backgroundColor: 'rgba(78, 115, 223, 0.05)',
                    borderColor: 'rgba(78, 115, 223, 1)',
                    pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
                    tension: 0.3
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateActivityChart(data) {
        this.activityChart.data.labels = data.labels;
        this.activityChart.data.datasets[0].data = data.values;
        this.activityChart.update();
    }
}

// Инициализация админ-панели при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.admin-dashboard')) {
        new AdminDashboard();
    }
});
