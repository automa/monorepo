import { BotBase, Repository, Schedule } from './bot';
import { DependencyBot } from './dependency';

export type Config = {
  repository?: Repository;
  schedule?: Schedule;
  bots?: {
    dependency?: DependencyBot;
    [key: string]:
      | (BotBase & {
          [key: string]: unknown;
        })
      | undefined;
  };
};
