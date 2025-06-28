import { createHmac } from 'node:crypto';

import axios from 'axios';

import { bots } from '@automa/prisma';

import { env } from '../env';

export const sendWebhook = <D>(
  type: string,
  id: string,
  bot: bots,
  data: D,
): Promise<void> => {
  const webhookId = `whmsg_${type.replaceAll('.', '_')}_${id}`;
  const timestamp = new Date();
  const unixTimestamp = Math.floor(timestamp.getTime() / 1000);

  const payload = {
    id: webhookId,
    type,
    data,
    // Better to keep the timestamp last to avoid issues with JSON serialization
    // in tests for generating the signature
    timestamp: timestamp.toISOString(),
  };

  // Create webhook signature
  const signature = createHmac('sha256', bot.webhook_secret.slice(11))
    .update(`${webhookId}.${unixTimestamp}.${JSON.stringify(payload)}`)
    .digest('base64');

  // Send webhook to bot
  return axios.post(bot.webhook_url, payload, {
    headers: {
      'webhook-id': webhookId,
      'webhook-timestamp': unixTimestamp,
      'webhook-signature': `v1,${signature}`,
      'x-automa-server-host': env.BASE_URI,
    },
  });
};

export const chunkArray = <T>(array: T[], chunkSize: number): T[][] =>
  Array(Math.ceil(array.length / chunkSize))
    .fill(0)
    .map((_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize));
