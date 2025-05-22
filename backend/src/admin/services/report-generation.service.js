const { PDFDocument, rgb } = require('pdf-lib');
const ExcelJS = require('exceljs');
const Transaction = require('../../../common/models/transaction.model');
const User = require('../../../common/models/user.model');
const logger = require('../../../common/utils/logger');

module.exports = {
  async generateReport(options) {
    try {
      switch (options.type) {
        case 'transactions':
          return this.generateTransactionReport(options);
        case 'user_activity':
          return this.generateUserActivityReport(options);
        default:
          throw new Error('Invalid report type');
      }
    } catch (error) {
      logger.error('Failed to generate report:', error);
      throw error;
    }
  },

  async generateTransactionReport({ startDate, endDate, reportType, format, requestedBy }) {
    const transactions = await Transaction.find({
      createdAt: { $gte: startDate, $lte: endDate },
      ...(reportType === 'completed' ? { status: 'completed' } : {}),
      ...(reportType === 'disputed' ? { status: 'disputed' } : {})
    })
      .populate('merchant', 'name email')
      .populate('trader', 'name email');

    switch (format) {
      case 'pdf':
        return this.generateTransactionPDF(transactions, startDate, endDate);
      case 'csv':
        return this.generateTransactionCSV(transactions);
      case 'excel':
        return this.generateTransactionExcel(transactions);
      default:
        throw new Error('Invalid format');
    }
  },

  async generateTransactionPDF(transactions, startDate, endDate) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();

    // Заголовок отчета
    page.drawText('Transaction Report', {
      x: 50,
      y: height - 50,
      size: 20,
      color: rgb(0, 0, 0)
    });

    // Период отчета
    page.drawText(`Period: ${startDate.toDateString()} - ${endDate.toDateString()}`, {
      x: 50,
      y: height - 80,
      size: 12,
      color: rgb(0, 0, 0)
    });

    // Таблица транзакций
    let y = height - 120;
    transactions.forEach((tx, index) => {
      page.drawText(`${index + 1}. ${tx._id} - ${tx.amount} ${tx.currency}`, {
        x: 50,
        y,
        size: 10,
        color: rgb(0, 0, 0)
      });
      y -= 20;
    });

    return await pdfDoc.save();
  },

  async generateTransactionCSV(transactions) {
    let csv = 'ID,Amount,Currency,Merchant,Trader,Status,Created At\n';
    transactions.forEach(tx => {
      csv += `${tx._id},${tx.amount},${tx.currency},${tx.merchant?.name || 'N/A'},${tx.trader?.name || 'N/A'},${tx.status},${tx.createdAt}\n`;
    });
    return csv;
  },

  async generateTransactionExcel(transactions) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    // Заголовки
    worksheet.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Amount', key: 'amount' },
      { header: 'Currency', key: 'currency' },
      { header: 'Merchant', key: 'merchant' },
      { header: 'Trader', key: 'trader' },
      { header: 'Status', key: 'status' },
      { header: 'Date', key: 'date' }
    ];

    // Данные
    transactions.forEach(tx => {
      worksheet.addRow({
        id: tx._id,
        amount: tx.amount,
        currency: tx.currency,
        merchant: tx.merchant?.name || 'N/A',
        trader: tx.trader?.name || 'N/A',
        status: tx.status,
        date: tx.createdAt
      });
    });

    // Генерация файла
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  },

  async generateUserActivityReport({ userIds, startDate, endDate, format }) {
    const users = await User.find({
      _id: { $in: userIds }
    });

    const activityData = await Promise.all(
      users.map(async user => {
        const transactions = await Transaction.countDocuments({
          $or: [{ merchant: user._id }, { trader: user._id }],
          createdAt: { $gte: startDate, $lte: endDate }
        });
        return {
          user,
          transactions
        };
      })
    );

    switch (format) {
      case 'pdf':
        return this.generateUserActivityPDF(activityData, startDate, endDate);
      case 'csv':
        return this.generateUserActivityCSV(activityData);
      case 'excel':
        return this.generateUserActivityExcel(activityData);
      default:
        throw new Error('Invalid format');
    }
  }
};
