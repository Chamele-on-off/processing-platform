const { generateReport } = require('../services/report-generation.service');
const { successResponse, errorResponse } = require('../../common/utils/api-response');
const logger = require('../../common/utils/logger');

exports.generateTransactionReport = async (req, res) => {
  try {
    const { startDate, endDate, reportType, format = 'pdf' } = req.body;

    if (!['pdf', 'csv', 'excel'].includes(format)) {
      return errorResponse(res, 'Invalid report format', null, 400);
    }

    const report = await generateReport({
      type: 'transactions',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reportType,
      format,
      requestedBy: req.user.id
    });

    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=transactions_report_${Date.now()}.pdf`);
      return res.send(report);
    } else if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=transactions_report_${Date.now()}.csv`);
      return res.send(report);
    } else {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=transactions_report_${Date.now()}.xlsx`);
      return res.send(report);
    }
  } catch (error) {
    logger.error('Failed to generate transaction report:', error);
    errorResponse(res, 'Failed to generate report', error);
  }
};

exports.generateUserActivityReport = async (req, res) => {
  try {
    const { userIds, startDate, endDate, format = 'pdf' } = req.body;

    const report = await generateReport({
      type: 'user_activity',
      userIds,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      format,
      requestedBy: req.user.id
    });

    // Аналогичная обработка разных форматов как в generateTransactionReport
    // ...
    
    successResponse(res, 'Report generated successfully', { reportId: report.id });
  } catch (error) {
    logger.error('Failed to generate user activity report:', error);
    errorResponse(res, 'Failed to generate report', error);
  }
};

exports.getReportHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const reports = await Report.find({ requestedBy: req.user.id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Report.countDocuments({ requestedBy: req.user.id });

    successResponse(res, 'Report history retrieved', {
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Failed to get report history:', error);
    errorResponse(res, 'Failed to retrieve report history', error);
  }
};
