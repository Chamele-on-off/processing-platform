export class TriangleAPI {
  static BASE_URL = '/api/triangle';

  static async createManual(depositIds, payoutId) {
    const response = await fetch(`${this.BASE_URL}/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ depositIds, payoutId })
    });
    return response.json();
  }

  static async getSettings() {
    const response = await fetch(`${this.BASE_URL}/settings`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  }

  static async updateSettings(settings) {
    const response = await fetch(`${this.BASE_URL}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(settings)
    });
    return response.json();
  }
}
