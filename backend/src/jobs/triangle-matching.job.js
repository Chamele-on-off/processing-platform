import cron from 'node-cron';
import TriangleService from '../services/triangle.service.js';
import logger from '../utils/logger.js';

class TriangleMatchingJob {
  static start() {
    cron.schedule('*/5 * * * *', async () => {
      try {
        logger.info('Running triangle matching job');
        await TriangleService.processAutoMatching();
      } catch (error) {
        logger.error('Triangle matching job failed:', error);
      }
    });
  }
}

export default TriangleMatchingJob;
