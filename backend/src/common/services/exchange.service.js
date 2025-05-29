const axios = require('axios');
const logger = require('../utils/logger');
const redis = require('../config/redis');

class ExchangeService {
  constructor() {
    this.baseUrl = 'https://api.exchangerate-api.com/v4/latest';
    this.cacheKey = 'exchange_rates';
    this.cacheTTL = 3600; // 1 hour
  }

  async getRates(baseCurrency = 'USD') {
    try {
      // Try to get from cache first
      const cached = await redis.get(this.cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // Fetch fresh rates
      const response = await axios.get(`${this.baseUrl}/${baseCurrency}`);
      const rates = {
        base: response.data.base,
        rates: response.data.rates,
        timestamp: response.data.timestamp
      };

      // Cache the new rates
      await redis.set(this.cacheKey, JSON.stringify(rates), 'EX', this.cacheTTL);
      
      return rates;
    } catch (error) {
      logger.error('Exchange rates fetch failed:', error);
      throw error;
    }
  }

  async convert(amount, fromCurrency, toCurrency) {
    try {
      const rates = await this.getRates(fromCurrency);
      const rate = rates.rates[toCurrency];
      
      if (!rate) {
        throw new Error('Invalid currency');
      }

      return amount * rate;
    } catch (error) {
      logger.error('Currency conversion failed:', error);
      throw error;
    }
  }
}

module.exports = new ExchangeService();
