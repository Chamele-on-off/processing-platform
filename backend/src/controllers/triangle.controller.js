import TriangleService from '../services/triangle.service.js';
import ApiError from '../exceptions/api-error.js';

class TriangleController {
  async getTransactions(req, res, next) {
    try {
      const transactions = await TriangleService.getAllTransactions();
      res.json(transactions);
    } catch (e) {
      next(e);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await TriangleService.getStats();
      res.json(stats);
    } catch (e) {
      next(e);
    }
  }

  async confirmTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const result = await TriangleService.confirmTransaction(id, req.user.id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async cancelTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const result = await TriangleService.cancelTransaction(id, req.user.id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async createManual(req, res, next) {
    try {
      const { depositIds, payoutId } = req.body;
      const result = await TriangleService.createManualTransaction(
        depositIds,
        payoutId,
        req.user.id
      );
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async getSettings(req, res, next) {
    try {
      const settings = await TriangleService.getSettings();
      res.json(settings);
    } catch (e) {
      next(e);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const settings = req.body;
      const result = await TriangleService.updateSettings(settings, req.user.id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async searchTransactions(req, res, next) {
    try {
      const { q } = req.query;
      const result = await TriangleService.searchTransactions(q);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export default new TriangleController();
