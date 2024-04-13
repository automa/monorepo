import { DependencyBot, DependencyEcosystem } from '../types';

import { Config, Group, PackageEcosystem } from './types';

export const fromDependabot = (config: Config): DependencyBot => {
  const { updates } = config;

  if (updates.length === 0) {
    return {
      enabled: false,
      groups: [],
    };
  }

  const groups = updates.flatMap(
    ({
      'package-ecosystem': ecosystem,
      directory,
      allow,
      assignees,
      'commit-message': commitMessage,
      groups: updateGroups,
      ignore,
      labels,
      milestone,
      'open-pull-requests-limit': limit,
      'pull-request-branch-name': branchName,
      'rebase-strategy': rebaseStrategy,
      registries,
      reviewers,
      'versioning-strategy': versioningStrategy,
    }) => {
      const repository = {
        ...(assignees && {
          assignees,
        }),
        labels: labels ?? ['dependencies', languageLabel(ecosystem)],
        ...(reviewers && {
          reviewers,
        }),
      };

      const common = {
        ecosystems: [convertEcosystem(ecosystem)],
        ...(!['', '/'].includes(directory) && {
          manifests: [`${directory}/**`],
        }),
        repository,
      };

      const convertedUpdateGroups = Object.entries(updateGroups || {}).map(
        (entry) => ({
          ...common,
          ...(limit === 0 && {
            enabled: false,
          }),
          ...convertGroup(entry),
        }),
      );

      return [
        ...convertedUpdateGroups,
        {
          ...common,
          ...(limit === 0
            ? {
                enabled: false,
              }
            : {
                limit: limit ?? 5,
              }),
        },
      ];
    },
  );

  return {
    groups,
  };
};

const convertEcosystem = (ecosystem: PackageEcosystem) => {
  switch (ecosystem) {
    case PackageEcosystem.Bundler:
      return DependencyEcosystem.RubyGems;

    case PackageEcosystem.Cargo:
      return DependencyEcosystem.Cargo;

    case PackageEcosystem.Composer:
      return DependencyEcosystem.Composer;

    case PackageEcosystem.DevContainers:
      return DependencyEcosystem.DevContainers;

    case PackageEcosystem.Docker:
      return DependencyEcosystem.Docker;

    case PackageEcosystem.Mix:
      return DependencyEcosystem.Hex;

    case PackageEcosystem.Elm:
      return DependencyEcosystem.Elm;

    case PackageEcosystem.GitSubmodule:
      return DependencyEcosystem.GitSubmodule;

    case PackageEcosystem.GithubActions:
      return DependencyEcosystem.GithubActions;

    case PackageEcosystem.GoModules:
      return DependencyEcosystem.GoModules;

    case PackageEcosystem.Gradle:
      return DependencyEcosystem.Gradle;

    case PackageEcosystem.Maven:
      return DependencyEcosystem.Maven;

    case PackageEcosystem.NPM:
      return DependencyEcosystem.NPM;

    case PackageEcosystem.NuGet:
      return DependencyEcosystem.NuGet;

    case PackageEcosystem.Pip:
      return DependencyEcosystem.PyPI;

    case PackageEcosystem.Pub:
      return DependencyEcosystem.Pub;

    case PackageEcosystem.Swift:
      return DependencyEcosystem.Swift;

    case PackageEcosystem.Terraform:
      return DependencyEcosystem.Terraform;
  }
};

const languageLabel = (ecosystem: PackageEcosystem) => {
  switch (ecosystem) {
    case PackageEcosystem.Bundler:
      return 'ruby';

    case PackageEcosystem.Cargo:
      return 'rust';

    case PackageEcosystem.Composer:
      return 'php';

    case PackageEcosystem.DevContainers:
      return 'devcontainers_package_manager';

    case PackageEcosystem.Docker:
      return 'docker';

    case PackageEcosystem.Mix:
      return 'elixir';

    case PackageEcosystem.Elm:
      return 'elm';

    case PackageEcosystem.GitSubmodule:
      return 'submodules';

    case PackageEcosystem.GithubActions:
      return 'github_actions';

    case PackageEcosystem.GoModules:
      return 'go';

    case PackageEcosystem.Gradle:
      return 'java';

    case PackageEcosystem.Maven:
      return 'java';

    case PackageEcosystem.NPM:
      return 'javascript';

    case PackageEcosystem.NuGet:
      return '.NET';

    case PackageEcosystem.Pip:
      return 'python';

    case PackageEcosystem.Pub:
      return 'dart';

    case PackageEcosystem.Swift:
      return 'swift_package_manager';

    case PackageEcosystem.Terraform:
      return 'terraform';
  }
};

const convertGroup = ([
  key,
  {
    'dependency-type': dependencyType,
    patterns,
    'exclude-patterns': excludePatterns,
    'update-types': updateTypes,
  },
]: [string, Group]) => ({
  combined: true,
  ...(dependencyType && {
    matchDepTypes: [dependencyType],
  }),
  ...(patterns && {
    matchPackagePatterns: patterns,
  }),
  ...(excludePatterns && {
    excludePackagePatterns: excludePatterns,
  }),
  ...(updateTypes && {
    matchUpdateTypes: updateTypes,
  }),
});
