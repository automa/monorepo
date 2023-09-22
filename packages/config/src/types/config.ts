import { BotBase, Repository, Schedule } from './bot';

export type Config = {
  repository?: Repository;
  schedule?: Schedule;
  bots?: {
    [key: string]:
      | (BotBase & {
          [key: string]: unknown;
        })
      | undefined;
  };
};
