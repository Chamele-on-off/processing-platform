const axios = require('axios');
const logger = require('../../../utils/logger');

module.exports = {
  async check(transaction) {
    try {
      const anomalies = [];
      
      if (!transaction.ipAddress) {
        return anomalies;
      }

      // Получаем геоданные по IP
      const geoData = await this.getIpGeoData(transaction.ipAddress);
      
      // Проверка 1: Совпадение страны транзакции и страны пользователя
      if (geoData.country !== transaction.userCountry) {
        anomalies.push('ip_country_mismatch');
      }

      // Проверка 2: Подозрительные локации (VPN, прокси)
      if (geoData.isProxy || geoData.isVpn) {
        anomalies.push('suspicious_ip_location');
      }

      return anomalies;
    } catch (error) {
      logger.error('IP geo rule check failed:', error);
      return [];
    }
  },

  async getIpGeoData(ip) {
    try {
      const response = await axios.get(`https://ipapi.co/${ip}/json/`);
      return {
        country: response.data.country,
        isProxy: response.data.proxy || response.data.usingTor,
        isVpn: response.data.vpn
      };
    } catch (error) {
      logger.error('Failed to get IP geo data:', error);
      return {
        country: null,
        isProxy: false,
        isVpn: false
      };
    }
  }
};
