const Order = require('../../../common/models/order.model');
const { checkTraderLimits } = require('../../../common/antifraud/rules/transaction-patterns.rule');

exports.getActiveOrders = async (traderId) => {
  return Order.find({
    status: 'active',
    assignedTrader: traderId
  }).sort({ priority: -1, createdAt: 1 });
};

exports.processOrder = async (orderId, traderId) => {
  const order = await Order.findById(orderId);
  
  // Проверка лимитов трейдера
  await checkTraderLimits(traderId, order.amount);
  
  // Обновление статуса заявки
  order.status = 'processing';
  order.processedBy = traderId;
  order.processingStartedAt = new Date();
  
  await order.save();
  
  return {
    orderId: order._id,
    status: order.status,
    amount: order.amount
  };
};
