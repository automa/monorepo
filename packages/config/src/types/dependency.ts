import { BotBase, RepositoryExtended, Schedule } from './bot';

export enum DependencyEcosystem {
  Cargo = 'cargo',
  Composer = 'composer',
  DevContainers = 'devcontainers',
  Docker = 'docker',
  Elm = 'elm',
  GitSubmodule = 'gitsubmodule',
  GithubActions = 'github-actions',
  GoModules = 'gomod',
  Gradle = 'gradle',
  Hex = 'hex',
  Maven = 'maven',
  NPM = 'npm',
  NuGet = 'nuget',
  PyPI = 'pip',
  Pub = 'pub',
  RubyGems = 'rubygems',
  Swift = 'swift',
  Terraform = 'terraform',
}

export type DependencyGroup = {
  ecosystems?: DependencyEcosystem[];
  manifests?: string[];
  enabled?: boolean;
  limit?: number;
  combined?: boolean;
  excludePackagePatterns?: string[];
  matchPackagePatterns?: string[];
  matchDepTypes?: string[];
  matchUpdateTypes?: string[];
  repository?: RepositoryExtended;
  schedule?: Schedule;
};

export type DependencyBot = BotBase & {
  // TODO:(PR) Does it need `?` here?
  groups?: DependencyGroup[];
  limit?: number;
};
