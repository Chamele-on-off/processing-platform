/**
 * Основной файл с общими функциями для всей платформы
 */

class ProcessingPlatform {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api/v1';
        this.authToken = localStorage.getItem('authToken');
        this.initEventListeners();
    }

    initEventListeners() {
        // Обработчик для всех кнопок выхода
        document.querySelectorAll('#logout-btn').forEach(btn => {
            btn.addEventListener('click', this.logout.bind(this));
        });
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        const url = `${this.apiBaseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
        };

        const config = {
            method,
            headers,
            credentials: 'include'
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            this.showError(error.message);
            throw error;
        }
    }

    showError(message) {
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger position-fixed top-0 end-0 m-3';
        errorAlert.style.zIndex = '1100';
        errorAlert.innerHTML = `
            <button type="button" class="btn-close float-end" data-bs-dismiss="alert"></button>
            <strong>Ошибка!</strong> ${message}
        `;
        
        document.body.appendChild(errorAlert);
        
        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            errorAlert.remove();
        }, 5000);
    }

    showSuccess(message) {
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success position-fixed top-0 end-0 m-3';
        successAlert.style.zIndex = '1100';
        successAlert.innerHTML = `
            <button type="button" class="btn-close float-end" data-bs-dismiss="alert"></button>
            <strong>Успешно!</strong> ${message}
        `;
        
        document.body.appendChild(successAlert);
        
        // Автоматическое закрытие через 3 секунд
        setTimeout(() => {
            successAlert.remove();
        }, 3000);
    }

    logout() {
        localStorage.removeItem('authToken');
        window.location.href = '../../login.html';
    }

    formatCurrency(amount, currency = 'RUB') {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency
        }).format(amount);
    }

    formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    // Инициализация всех tooltips на странице
    initTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Инициализация всех popovers на странице
    initPopovers() {
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
}

// Инициализация глобального объекта платформы
const platform = new ProcessingPlatform();

// Инициализация tooltips и popovers при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    platform.initTooltips();
    platform.initPopovers();
});
