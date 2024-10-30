import process from 'process';
import { Queue } from 'bullmq';
import redisConfig from '../config/redis.js';
import logger from '../helpers/logger.js';

const CONNECTION_REFUSED = 'ECONNREFUSED';

const redisConnection = {
  connection: redisConfig,
};

const llmSchedulerQueue = new Queue('llm-scheduler', redisConnection);

process.on('SIGTERM', async () => {
  await llmSchedulerQueue.close();
});

llmSchedulerQueue.on('error', (error) => {
  if (error.code === CONNECTION_REFUSED) {
    logger.error(
      'Make sure you have installed Redis and it is running.',
      error
    );

    process.exit();
  }

  logger.error('Error happened in llm scheduler queue!', error);
});

llmSchedulerQueue.add('llm-scheduler', null, {
  jobId: 'llm-scheduler',
  repeat: {
    pattern: '*/1 * * * *',
  },
});

export default llmSchedulerQueue;
