export type Repository = {
  assignees?: string[];
  labels?: string[];
  reviewers?: string[];
};

export type RepositoryExtended = Repository & {
  assigneesOverride?: string[];
  labelsOverride?: string[];
  reviewersOverride?: string[];
};

export type Schedule = object;

export type BotBase = {
  enabled?: boolean;
  repository?: RepositoryExtended;
  schedule?: Schedule;
};
