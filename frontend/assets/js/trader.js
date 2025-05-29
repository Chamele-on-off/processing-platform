/**
 * Модуль для панели трейдера
 */

class TraderDashboard {
    constructor() {
        this.initCharts();
        this.loadDashboardData();
        this.loadActiveOrders();
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('refresh-orders').addEventListener('click', this.loadActiveOrders.bind(this));
        document.getElementById('new-order-btn').addEventListener('click', this.showNewOrderModal.bind(this));
        document.getElementById('submit-order').addEventListener('click', this.createNewOrder.bind(this));
        document.getElementById('enable-deposit').addEventListener('click', this.toggleDeposit.bind(this, true));
        document.getElementById('disable-deposit').addEventListener('click', this.toggleDeposit.bind(this, false));
        document.getElementById('add-details').addEventListener('click', this.showAddDetailsModal.bind(this));
    }

    async loadDashboardData() {
        try {
            const data = await platform.makeRequest('/trader/dashboard');
            
            // Обновляем карточки статистики
            document.getElementById('balance').textContent = platform.formatCurrency(data.balance);
            document.getElementById('today-orders').textContent = data.todayOrders;
            document.getElementById('conversion-rate').textContent = `${data.conversionRate}%`;
            document.getElementById('avg-time').textContent = `${data.avgProcessingTime} мин`;
            
            // Обновляем круговую диаграмму
            this.updateWeeklyStatsChart(data.weeklyStats);
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            platform.showError('Ошибка загрузки данных');
        }
    }

    async loadActiveOrders() {
        try {
            const orders = await platform.makeRequest('/trader/orders/active');
            const tbody = document.getElementById('active-orders');
            tbody.innerHTML = '';
            
            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${platform.formatCurrency(order.amount, order.currency)}</td>
                    <td>${this.getMethodText(order.method)}</td>
                    <td><span class="badge bg-${this.getStatusBadgeClass(order.status)}">${this.getStatusText(order.status)}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" data-order-id="${order.id}" data-action="view">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${order.status === 'pending' ? `
                        <button class="btn btn-sm btn-outline-success ms-1" data-order-id="${order.id}" data-action="accept">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger ms-1" data-order-id="${order.id}" data-action="reject">
                            <i class="fas fa-times"></i>
                        </button>
                        ` : ''}
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Добавляем обработчики для кнопок действий
            document.querySelectorAll('[data-action="view"]').forEach(btn => {
                btn.addEventListener('click', this.viewOrderDetails.bind(this));
            });
            
            document.querySelectorAll('[data-action="accept"]').forEach(btn => {
                btn.addEventListener('click', this.acceptOrder.bind(this));
            });
            
            document.querySelectorAll('[data-action="reject"]').forEach(btn => {
                btn.addEventListener('click', this.rejectOrder.bind(this));
            });
            
        } catch (error) {
            console.error('Failed to load active orders:', error);
            platform.showError('Ошибка загрузки заявок');
        }
    }

    getMethodText(method) {
        switch (method) {
            case 'bank_account': return 'Банковский счет';
            case 'card': return 'Карта';
            case 'crypto': return 'Криптовалюта';
            default: return method;
        }
    }

    getStatusBadgeClass(status) {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'rejected': return 'danger';
            default: return 'secondary';
        }
    }

    getStatusText(status) {
        switch (status) {
            case 'completed': return 'Завершено';
            case 'pending': return 'Ожидание';
            case 'processing': return 'В работе';
            case 'rejected': return 'Отклонено';
            default: return status;
        }
    }

    initCharts() {
        // Круговая диаграмма статистики за неделю
        const weeklyStatsCtx = document.getElementById('weeklyStatsChart');
        this.weeklyStatsChart = new Chart(weeklyStatsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Успешно', 'Отклонено', 'В процессе'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ['#1cc88a', '#e74a3b', '#f6c23e'],
                    hoverBackgroundColor: ['#17a673', '#be2617', '#dda20a'],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }],
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '80%',
            },
        });
    }

    updateWeeklyStatsChart(data) {
        this.weeklyStatsChart.data.datasets[0].data = [
            data.completed,
            data.rejected,
            data.processing
        ];
        this.weeklyStatsChart.update();
    }

    showNewOrderModal() {
        // Загружаем список реквизитов перед открытием модального окна
        this.loadPaymentDetails().then(() => {
            const modal = new bootstrap.Modal(document.getElementById('newOrderModal'));
            modal.show();
        });
    }

    async loadPaymentDetails() {
        try {
            const details = await platform.makeRequest('/trader/payment-details');
            const select = document.getElementById('order-details');
            select.innerHTML = '';
            
            details.forEach(detail => {
                const option = document.createElement('option');
                option.value = detail.id;
                option.textContent = `${detail.type} (${detail.details.accountNumber || detail.details.cardNumber})`;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to load payment details:', error);
            platform.showError('Ошибка загрузки реквизитов');
        }
    }

    async createNewOrder() {
        const type = document.getElementById('order-type').value;
        const amount = document.getElementById('order-amount').value;
        const method = document.getElementById('order-method').value;
        const detailsId = document.getElementById('order-details').value;
        
        try {
            const response = await platform.makeRequest('/trader/orders', 'POST', {
                type,
                amount: parseFloat(amount),
                method,
                detailsId
            });
            
            platform.showSuccess('Заявка успешно создана');
            this.loadActiveOrders();
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('newOrderModal'));
            modal.hide();
        } catch (error) {
            console.error('Failed to create order:', error);
            platform.showError('Ошибка создания заявки');
        }
    }

    async toggleDeposit(enable) {
        try {
            await platform.makeRequest('/trader/deposit-toggle', 'POST', { enable });
            platform.showSuccess(`Депозиты ${enable ? 'включены' : 'выключены'}`);
        } catch (error) {
            console.error('Failed to toggle deposit:', error);
            platform.showError('Ошибка изменения статуса депозитов');
        }
    }

    viewOrderDetails(e) {
        const orderId = e.currentTarget.getAttribute('data-order-id');
        // Здесь должна быть реализация просмотра деталей заявки
        console.log('View order:', orderId);
    }

    async acceptOrder(e) {
        const orderId = e.currentTarget.getAttribute('data-order-id');
        
        try {
            await platform.makeRequest(`/trader/orders/${orderId}/accept`, 'POST');
            platform.showSuccess('Заявка принята');
            this.loadActiveOrders();
        } catch (error) {
            console.error('Failed to accept order:', error);
            platform.showError('Ошибка принятия заявки');
        }
    }

    async rejectOrder(e) {
        const orderId = e.currentTarget.getAttribute('data-order-id');
        
        try {
            await platform.makeRequest(`/trader/orders/${orderId}/reject`, 'POST');
            platform.showSuccess('Заявка отклонена');
            this.loadActiveOrders();
        } catch (error) {
            console.error('Failed to reject order:', error);
            platform.showError('Ошибка отклонения заявки');
        }
    }

    showAddDetailsModal() {
        // Здесь должна быть реализация модального окна добавления реквизитов
        console.log('Show add details modal');
    }
}

// Инициализация панели трейдера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.trader-dashboard')) {
        new TraderDashboard();
    }
});
