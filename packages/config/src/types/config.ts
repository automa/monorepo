import { BotBase, Repository } from './bot';

export type Config = {
  repository?: Repository;
  bots?: {
    [key: string]:
      | (BotBase & {
          [key: string]: unknown;
        })
      | undefined;
  };
};
