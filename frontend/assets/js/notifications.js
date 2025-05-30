class NotificationCenter {
  static init() {
    this.socket = new WebSocket(`wss://${window.location.host}/ws/notifications`);
    
    this.socket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.showNotification(notification);
      
      if (notification.type === 'new_transaction') {
        this.playSound('/assets/sounds/alert.mp3');
      }
    };

    this.setupPushPermissions();
  }

  static showNotification({ title, message, type = 'info' }) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
      <strong>${title}</strong>
      <span>${message}</span>
      <button class="close">&times;</button>
    `;
    
    document.querySelector('.notifications-container').appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
  }

  static playSound(src) {
    const audio = new Audio(src);
    audio.play().catch(e => console.error('Audio playback failed:', e));
  }

  static setupPushPermissions() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.notifications-container')) {
    NotificationCenter.init();
  }
});
