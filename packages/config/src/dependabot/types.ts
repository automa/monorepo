export enum PackageEcosystem {
  Bundler = 'bundler',
  Cargo = 'cargo',
  Composer = 'composer',
  DevContainers = 'devcontainers',
  Docker = 'docker',
  Mix = 'mix',
  Elm = 'elm',
  GitSubmodule = 'gitsubmodule',
  GithubActions = 'github-actions',
  GoModules = 'gomod',
  Gradle = 'gradle',
  Maven = 'maven',
  NPM = 'npm',
  NuGet = 'nuget',
  Pip = 'pip',
  Pub = 'pub',
  Swift = 'swift',
  Terraform = 'terraform',
}

export type Schedule = {
  time?: string;
  timezone?: string;
} & (
  | {
      interval: 'weekly';
      day?:
        | 'monday'
        | 'tuesday'
        | 'wednesday'
        | 'thursday'
        | 'friday'
        | 'saturday'
        | 'sunday';
    }
  | {
      interval: 'daily' | 'monthly';
    }
);

export type Allow = {
  'dependency-name'?: string;
  'dependency-type'?:
    | 'direct'
    | 'indirect'
    | 'all'
    | 'production'
    | 'development';
};

export type CommitMessage = {
  prefix?: string;
  'prefix-development'?: string;
  include?: 'scope';
};

export type GroupUpdateType = 'major' | 'minor' | 'patch';

export type Group = {
  'dependency-type'?: 'production' | 'development';
  patterns?: string[];
  'exclude-patterns'?: string[];
  'update-types'?: GroupUpdateType[];
};

export type IgnoreUpdateType =
  | 'version-update:semver-major'
  | 'version-update:semver-minor'
  | 'version-update:semver-patch';

export type Ignore = {
  'dependency-name'?: string;
  versions?: string[];
  'update-type'?: IgnoreUpdateType[];
};

export type Update = {
  'package-ecosystem': PackageEcosystem;
  directory: string;
  schedule: Schedule;
  allow?: Allow[];
  assignees?: string[];
  'commit-message'?: CommitMessage;
  groups?: Record<string, Group>;
  ignore?: Ignore[];
  'insecure-external-code-execution'?: 'allow' | 'deny';
  labels?: string[];
  milestone?: string | number;
  'open-pull-requests-limit'?: number;
  'pull-request-branch-name'?: {
    separator: '-' | '_' | '/';
  };
  'rebase-strategy'?: 'auto' | 'disabled';
  registries?: string[];
  reviewers?: string[];
  'target-branch'?: string;
  vendor?: boolean;
  'versioning-strategy'?:
    | 'auto'
    | 'increase'
    | 'increase-if-necessary'
    | 'lockfile-only'
    | 'widen';
};

export enum RegistryType {
  ComposerRepository = 'composer-repository',
  DockerRegistry = 'docker-registry',
  Git = 'git',
  HexOrganization = 'hex-organization',
  HexRepository = 'hex-repository',
  MavenRepository = 'maven-repository',
  NpmRegistry = 'npm-registry',
  NugetFeed = 'nuget-feed',
  PythonIndex = 'python-index',
  RubygemsServer = 'rubygems-server',
  TerraformRegistry = 'terraform-registry',
}

export type Registry = {
  type: RegistryType;
  url?: string;
  username?: string;
  password?: string;
  key?: string;
  token?: string;
  'replaces-base'?: boolean;
  organization?: string;
  repo?: string;
  'auth-key'?: string;
  'public-key-fingerprint'?: string;
};

export type Config = {
  version: 2 | '2';
  updates: Update[];
  registries?: Record<string, Registry>;
};
