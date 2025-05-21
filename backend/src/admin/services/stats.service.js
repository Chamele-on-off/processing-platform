const { TraderMetrics, MerchantMetrics } = require('../../../common/stats/metrics');
const Transaction = require('../../../common/models/transaction.model');
const Order = require('../../../common/models/order.model');

exports.getPlatformStats = async () => {
  const [transactions, orders] = await Promise.all([
    Transaction.aggregate([...TraderMetrics.platformAggregation()]),
    Order.aggregate([...MerchantMetrics.platformAggregation()])
  ]);
  
  return {
    transactions,
    orders,
    timestamp: new Date()
  };
};

exports.getTraderStats = async (traderId) => {
  const stats = await Transaction.aggregate([
    { $match: { trader: traderId } },
    ...TraderMetrics.individualAggregation()
  ]);
  
  return {
    traderId,
    stats,
    lastUpdated: new Date()
  };
};
