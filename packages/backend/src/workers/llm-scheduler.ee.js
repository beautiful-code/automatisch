import { Worker } from 'bullmq';
import process from 'node:process';

import * as Sentry from '../helpers/sentry.ee.js';
import redisConfig from '../config/redis.js';
import logger from '../helpers/logger.js';
import llmSchedulerQueue from '../queues/llm-scheduler.ee.js';
import Flow from '../models/flow.js';
import flowQueue from '../queues/flow.js';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '../helpers/remove-job-configuration.js';

const EVERY_1_MINUTE_CRON = '*/2 * * * *';
const JOB_NAME = 'flow';
export const worker = new Worker(
  'llm-scheduler',
  async (job) => {
    const flows = await Flow.query()
      .whereNotNull('published_at')
      .whereNull('deleted_at')
      .andWhere('auto_scheduled', false);

    for (const flow of flows) {
      const triggerStep = await flow.getTriggerStep();
      const trigger = await triggerStep.getTriggerCommand();
      const interval = trigger.getInterval?.(triggerStep.parameters);

      const repeatOptions = {
        pattern: interval || EVERY_1_MINUTE_CRON,
      };

      if (trigger['type'] === 'webhook') {
        logger.info(
          `Skipping flow: Flow ID: ${flow.id}, Flow Name: ${flow.name}`
        );
        continue;
      }

      const jobName = `${JOB_NAME}-${flow['name']}-${flow.id}`;
      logger.info(
        `Adding flow to the queue: Flow ID: ${flow.id}, Flow Name: ${flow.name}`
      );

      await flowQueue.add(
        jobName,
        { flowId: flow.id },
        {
          repeat: repeatOptions,
          jobId: flow.id,
          removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
          removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
        }
      );

      await Flow.query().findById(flow.id).patch({ auto_scheduled: true });
    }
  },
  { connection: redisConfig }
);

worker.on('completed', (job) => {
  logger.info(`JOB ID: ${job.id} - LLM Scheduler has completed!`);
});

worker.on('failed', async (job, err) => {
  const errorMessage = `
    JOB ID: ${job.id} - LLM Scheduler has failed to start with ${err.message}
    \n ${err.stack}
  `;
  logger.error(errorMessage);
});

process.on('SIGTERM', async () => {
  await worker.close();
});
