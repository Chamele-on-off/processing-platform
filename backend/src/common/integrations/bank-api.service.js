const axios = require('axios');
const logger = require('../utils/logger');
const config = require('../config');

class BankApiService {
  constructor() {
    this.baseUrl = config.bankApi.url;
    this.authToken = config.bankApi.token;
    this.timeout = 10000;
  }

  async verifyPayment(paymentDetails, amount) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/payments/verify`,
        {
          account: paymentDetails.accountNumber,
          amount,
          bank: paymentDetails.bankName
        },
        {
          headers: { Authorization: `Bearer ${this.authToken}` },
          timeout: this.timeout
        }
      );

      return response.data.status === 'completed';
    } catch (error) {
      logger.error('Bank API verification failed:', error);
      return false;
    }
  }

  async getAccountDetails(accountNumber) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/accounts/${accountNumber}`,
        {
          headers: { Authorization: `Bearer ${this.authToken}` },
          timeout: this.timeout
        }
      );

      return {
        owner: response.data.owner_name,
        status: response.data.status,
        balance: response.data.balance
      };
    } catch (error) {
      logger.error('Bank API account details failed:', error);
      return null;
    }
  }
}

module.exports = new BankApiService();
