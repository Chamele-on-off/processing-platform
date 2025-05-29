/**
 * Модуль для работы с авторизацией
 */

class AuthManager {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        if (this.loginForm) {
            this.initLoginForm();
        }
    }

    initLoginForm() {
        this.loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            try {
                const response = await platform.makeRequest('/auth/login', 'POST', {
                    email,
                    password
                });

                // Сохраняем токен
                localStorage.setItem('authToken', response.token);
                
                // Перенаправляем в зависимости от роли
                this.redirectByRole(response.user.role);
            } catch (error) {
                console.error('Login failed:', error);
                platform.showError('Неверный email или пароль');
            }
        });
    }

    redirectByRole(role) {
        switch (role) {
            case 'admin':
                window.location.href = '../admin/index.html';
                break;
            case 'trader':
                window.location.href = '../trader/index.html';
                break;
            case 'merchant':
                window.location.href = '../merchant/index.html';
                break;
            default:
                window.location.href = '../index.html';
        }
    }

    async checkAuth() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token');
            }

            const response = await platform.makeRequest('/auth/check', 'GET');
            return response.user;
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('authToken');
            window.location.href = '../../login.html';
            return null;
        }
    }
}

// Инициализация менеджера авторизации
const authManager = new AuthManager();

// Проверка авторизации для защищенных страниц
if (!window.location.pathname.includes('login.html') && 
    !window.location.pathname.includes('index.html')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const user = await authManager.checkAuth();
        if (user) {
            // Обновляем интерфейс в зависимости от роли пользователя
            this.updateUIForUser(user);
        }
    });
}

function updateUIForUser(user) {
    // Обновляем имя пользователя в интерфейсе
    document.querySelectorAll('.user-name').forEach(el => {
        el.textContent = user.name;
    });
    
    // Скрываем/показываем элементы в зависимости от роли
    if (user.role === 'trader') {
        document.querySelectorAll('.trader-only').forEach(el => {
            el.classList.remove('d-none');
        });
    } else if (user.role === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.classList.remove('d-none');
        });
    }
}
