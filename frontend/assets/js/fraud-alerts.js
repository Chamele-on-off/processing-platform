class FraudMonitor {
  static init() {
    if (!document.getElementById('fraudAlerts')) return;
    
    this.socket = new WebSocket(`wss://${window.location.host}/ws/fraud-alerts`);
    this.socket.onmessage = this.handleAlert.bind(this);
    this.loadRecentAlerts();
  }

  static async loadRecentAlerts() {
    try {
      const response = await fetch('/api/fraud/alerts', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const alerts = await response.json();
      this.renderAlerts(alerts);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  }

  static handleAlert(event) {
    const alert = JSON.parse(event.data);
    this.renderAlerts([alert]);
    this.playAlertSound();
    
    if (alert.severity === 'critical') {
      this.showCriticalAlertModal(alert);
    }
  }

  static renderAlerts(alerts) {
    const container = document.getElementById('fraudAlerts');
    alerts.forEach(alert => {
      const alertElement = document.createElement('div');
      alertElement.className = `fraud-alert ${alert.severity}`;
      alertElement.innerHTML = `
        <div class="alert-header">
          <span class="alert-id">#${alert.id}</span>
          <span class="alert-date">${Utils.formatDate(alert.timestamp)}</span>
        </div>
        <div class="alert-message">${alert.message}</div>
        <div class="alert-actions">
          <button class="btn-sm" data-alert-id="${alert.id}" data-action="resolve">Разрешено</button>
          <button class="btn-sm" data-alert-id="${alert.id}" data-action="block">Блокировать</button>
        </div>
      `;
      container.prepend(alertElement);
    });

    // Добавляем обработчики для кнопок
    document.querySelectorAll('[data-action="resolve"], [data-action="block"]')
      .forEach(btn => btn.addEventListener('click', this.handleAlertAction.bind(this)));
  }

  static async handleAlertAction(e) {
    const alertId = e.target.dataset.alertId;
    const action = e.target.dataset.action;

    try {
      const response = await fetch(`/api/fraud/alerts/${alertId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        e.target.closest('.fraud-alert').remove();
      }
    } catch (error) {
      console.error('Action failed:', error);
    }
  }

  static playAlertSound() {
    const audio = new Audio('/assets/sounds/alert.mp3');
    audio.play().catch(e => console.error('Sound play failed:', e));
  }

  static showCriticalAlertModal(alert) {
    const modal = document.createElement('div');
    modal.className = 'fraud-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>КРИТИЧЕСКОЕ ОПОВЕЩЕНИЕ</h3>
        <p>${alert.message}</p>
        <div class="modal-actions">
          <button id="fraudModalConfirm">Подтвердить</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('fraudModalConfirm').addEventListener('click', () => modal.remove());
  }
}

document.addEventListener('DOMContentLoaded', () => FraudMonitor.init());
