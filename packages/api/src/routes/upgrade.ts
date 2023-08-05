import { spawn, SpawnOptions } from 'child_process';

import { FastifyInstance } from 'fastify';

import { caller } from '../clients/github';

const command = async (
  command: string,
  args: string[] = [],
  options: SpawnOptions = {},
) => {
  const child = spawn(command, args, options);

  for await (const chunk of child.stdout!) {
    console.log(`${chunk}`);
  }

  for await (const chunk of child.stderr!) {
    console.log(`${chunk}`);
  }

  const exitCode = await new Promise((resolve) => {
    child.on('close', resolve);
  });

  if (exitCode) {
    throw new Error(`subprocess error exit ${exitCode}`);
  }

  console.log(`exited ${command} ${args.join(' ')}`);
};

const run = async (
  app: FastifyInstance,
  installationId: number,
  uri: string,
  language: string,
  dep: string,
  version: string,
) => {
  const { accessToken, axios } = await caller(app, installationId);

  const { data: repo } = await axios.get(`/repos/${uri}`);

  const workingDir = `/tmp/${uri}`;
  const branch = `automa/dependency/${language}/${dep}`;
  const commitMessage = `Upgrade ${dep} (${language}) to ${version}`;

  await command('rm', ['-rf', workingDir]);
  await command('git', [
    'clone',
    '--progress',
    `https://x-access-token:${accessToken}@github.com/${uri}`,
    workingDir,
  ]);
  await command('git', ['config', 'user.name', 'automa[bot]'], {
    cwd: workingDir,
  });
  await command(
    'git',
    ['config', 'user.email', '60525818+automa[bot]@@users.noreply.github.com'],
    { cwd: workingDir },
  );
  await command('git', ['checkout', '-b', branch], {
    cwd: workingDir,
  });
  await command(
    'cargo',
    [
      'run',
      '--features',
      'cli',
      '--no-default-features',
      'up',
      '--manifest-path',
      `${workingDir}/Cargo.toml`,
      'dep',
      dep,
      '--dep-version',
      version,
      '--lib-path',
      '.',
      '--upgrader-name',
      'uuid_upgrader',
      '--upgrader-path',
      '/home/pksunkara/Coding/pksunkara/uuid_upgrader',
    ],
    {
      cwd: '/home/pksunkara/Coding/pksunkara/cargo-up/cargo-up',
    },
  );
  await command('cargo', ['add', `${dep}@~${version}`], { cwd: workingDir });
  await command('cargo', ['fmt'], { cwd: workingDir });
  await command('git', ['add', '.'], { cwd: workingDir });
  await command('git', ['commit', '-m', commitMessage], {
    cwd: workingDir,
  });
  await command('git', ['push', '-f', 'origin', branch], { cwd: workingDir });

  await axios.post(`/repos/${uri}/pulls`, {
    title: commitMessage,
    head: branch,
    base: repo?.default_branch,
  });
};

export default async function (app: FastifyInstance) {
  app.get<{
    Params: {
      repoId: string;
    };
  }>('/upgrade/:repoId', async (request, reply) => {
    const repo = await app.prisma.repos.findUnique({
      where: {
        id: parseInt(request.params.repoId, 10),
      },
      include: {
        orgs: true,
      },
    });

    if (!repo?.orgs?.github_installation_id) {
      return reply.code(404).send();
    }

    run(
      app,
      repo.orgs.github_installation_id,
      `${repo.orgs.name}/${repo.name}`,
      'rust',
      'uuid',
      '1.0.0',
    );

    return reply.code(202).send();
  });
}
