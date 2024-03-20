export const CONFIG_FILES = [
  'automa.json',
  'automa.json5',
  '.github/automa.json',
  '.github/automa.json5',
];

export enum CauseType {
  REPOSITORY_ADDED = 1000,
  APP_INSTALLED_WITH_REPOSITORY,
  REPOSITORY_SYNCED_AFTER_UNSUSPENDED,
  DEFAULT_BRANCH_CHANGED,
  COMMIT_FORCE_PUSHED,
  COMMIT_SETTINGS_CHANGED,
  COMMIT_UNKNOWN_BASE,
}

export type Cause = {
  code: CauseType;
  message: string;
};

export const causes: { [key in CauseType]: Omit<Cause, 'code'> } = {
  [CauseType.REPOSITORY_ADDED]: {
    message: 'Repository has been added to the installation',
  },
  [CauseType.APP_INSTALLED_WITH_REPOSITORY]: {
    message: 'App has been installed with access to the repository',
  },
  [CauseType.REPOSITORY_SYNCED_AFTER_UNSUSPENDED]: {
    message:
      'Repostiory has been synced after the installation has been unsuspended',
  },
  [CauseType.DEFAULT_BRANCH_CHANGED]: {
    message: 'Default branch has been changed for the repository',
  },
  [CauseType.COMMIT_FORCE_PUSHED]: {
    message:
      'Commit has been force pushed to the default branch of the repository',
  },
  [CauseType.COMMIT_SETTINGS_CHANGED]: {
    message:
      'Commit has been pushed to the default branch of the repository with changes to the settings',
  },
  [CauseType.COMMIT_UNKNOWN_BASE]: {
    message:
      'Commit has been pushed to the default branch of the repository, but the base commit is unknown',
  },
};
