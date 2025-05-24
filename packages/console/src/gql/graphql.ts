/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Bot = BotBase & {
  __typename?: 'Bot';
  created_at: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['JSON']['output']>;
  draft_paths: Array<Scalars['String']['output']>;
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  is_deterministic: Scalars['Boolean']['output'];
  is_preview: Scalars['Boolean']['output'];
  is_published: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  org: Org;
  paths: Array<Scalars['String']['output']>;
  published_at?: Maybe<Scalars['DateTime']['output']>;
  short_description: Scalars['String']['output'];
  type: BotType;
  webhook_secret: Scalars['String']['output'];
  webhook_url: Scalars['String']['output'];
};

export type BotBase = {
  description?: Maybe<Scalars['JSON']['output']>;
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  is_deterministic: Scalars['Boolean']['output'];
  is_preview: Scalars['Boolean']['output'];
  is_published: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  paths: Array<Scalars['String']['output']>;
  short_description: Scalars['String']['output'];
  type: BotType;
};

export type BotCreateInput = {
  description?: InputMaybe<Scalars['JSON']['input']>;
  draft_paths: Array<Scalars['String']['input']>;
  homepage?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  short_description: Scalars['String']['input'];
  type: BotType;
  webhook_url: Scalars['String']['input'];
};

export type BotInstallInput = {
  bot_id: Scalars['Int']['input'];
};

export type BotInstallation = {
  __typename?: 'BotInstallation';
  bot: PublicBot;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  org: Org;
  tasks_count: Array<TasksCount>;
};

export type BotInstallationsFilter = {
  type?: InputMaybe<BotType>;
};

export enum BotType {
  Manual = 'manual',
  Scheduled = 'scheduled'
}

export type BotUpdateInput = {
  description?: InputMaybe<Scalars['JSON']['input']>;
  draft_paths?: InputMaybe<Array<Scalars['String']['input']>>;
  homepage?: InputMaybe<Scalars['String']['input']>;
  short_description?: InputMaybe<Scalars['String']['input']>;
  webhook_url?: InputMaybe<Scalars['String']['input']>;
};

export type Integration = {
  __typename?: 'Integration';
  author: User;
  config: Scalars['JSON']['output'];
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  type: IntegrationType;
};

export enum IntegrationType {
  Github = 'github',
  Jira = 'jira',
  Linear = 'linear',
  Slack = 'slack'
}

export type Mutation = {
  __typename?: 'Mutation';
  botCreate: Bot;
  botInstall: BotInstallation;
  botPublish: Bot;
  botUninstall: Scalars['Boolean']['output'];
  botUpdate: Bot;
  taskCreate: Task;
  userUpdate: User;
};


export type MutationBotCreateArgs = {
  input: BotCreateInput;
  org_id: Scalars['Int']['input'];
};


export type MutationBotInstallArgs = {
  input: BotInstallInput;
  org_id: Scalars['Int']['input'];
};


export type MutationBotPublishArgs = {
  name: Scalars['String']['input'];
  org_id: Scalars['Int']['input'];
};


export type MutationBotUninstallArgs = {
  bot_id: Scalars['Int']['input'];
  org_id: Scalars['Int']['input'];
};


export type MutationBotUpdateArgs = {
  input: BotUpdateInput;
  name: Scalars['String']['input'];
  org_id: Scalars['Int']['input'];
};


export type MutationTaskCreateArgs = {
  input: TaskCreateInput;
  org_id: Scalars['Int']['input'];
};


export type MutationUserUpdateArgs = {
  input: UserUpdateInput;
};

export type Org = {
  __typename?: 'Org';
  bot_installations_count: Scalars['Int']['output'];
  created_at: Scalars['DateTime']['output'];
  github_installation_id?: Maybe<Scalars['Int']['output']>;
  has_installation: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  is_user: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  provider_id: Scalars['String']['output'];
  provider_name: Scalars['String']['output'];
  provider_type: ProviderType;
};

export enum ProviderType {
  Github = 'github',
  Gitlab = 'gitlab'
}

export type PublicBot = BotBase & {
  __typename?: 'PublicBot';
  description?: Maybe<Scalars['JSON']['output']>;
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  installation?: Maybe<PublicBotInstallation>;
  is_deterministic: Scalars['Boolean']['output'];
  is_preview: Scalars['Boolean']['output'];
  is_published: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  org: PublicOrg;
  paths: Array<Scalars['String']['output']>;
  short_description: Scalars['String']['output'];
  type: BotType;
};


export type PublicBotInstallationArgs = {
  org_id: Scalars['Int']['input'];
};

export type PublicBotInstallation = {
  __typename?: 'PublicBotInstallation';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  org: PublicOrg;
};

export type PublicBotsFilter = {
  is_deterministic?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<BotType>;
};

export type PublicOrg = {
  __typename?: 'PublicOrg';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  provider_id: Scalars['String']['output'];
  provider_type: ProviderType;
};

export type Query = {
  __typename?: 'Query';
  bot: Bot;
  botInstallations: Array<BotInstallation>;
  bots: Array<Bot>;
  integrations: Array<Integration>;
  orgs: Array<Org>;
  publicBot: PublicBot;
  publicBots: Array<PublicBot>;
  repo?: Maybe<Repo>;
  repos: Array<Repo>;
  task: Task;
  tasks: Array<Task>;
  user: User;
};


export type QueryBotArgs = {
  name: Scalars['String']['input'];
  org_id: Scalars['Int']['input'];
};


export type QueryBotInstallationsArgs = {
  filter?: InputMaybe<BotInstallationsFilter>;
  org_id: Scalars['Int']['input'];
};


export type QueryBotsArgs = {
  org_id: Scalars['Int']['input'];
};


export type QueryIntegrationsArgs = {
  org_id: Scalars['Int']['input'];
};


export type QueryPublicBotArgs = {
  name: Scalars['String']['input'];
  org_name: Scalars['String']['input'];
};


export type QueryPublicBotsArgs = {
  filter?: InputMaybe<PublicBotsFilter>;
};


export type QueryRepoArgs = {
  name: Scalars['String']['input'];
  org_id: Scalars['Int']['input'];
};


export type QueryReposArgs = {
  filter?: InputMaybe<ReposFilter>;
  org_id: Scalars['Int']['input'];
};


export type QueryTaskArgs = {
  id: Scalars['Int']['input'];
  org_id: Scalars['Int']['input'];
};


export type QueryTasksArgs = {
  filter?: InputMaybe<TasksFilter>;
  org_id: Scalars['Int']['input'];
};

export type Repo = {
  __typename?: 'Repo';
  created_at: Scalars['DateTime']['output'];
  has_installation: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  is_archived: Scalars['Boolean']['output'];
  is_private: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  org: Org;
  provider_id: Scalars['String']['output'];
  tasks_count: Array<TasksCount>;
};

export type ReposFilter = {
  is_archived?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Task = {
  __typename?: 'Task';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  is_scheduled: Scalars['Boolean']['output'];
  items: Array<TaskItem>;
  org: Org;
  state: TaskState;
  title: Scalars['String']['output'];
};

export type TaskActivity = {
  __typename?: 'TaskActivity';
  from_state?: Maybe<TaskState>;
  id: Scalars['Int']['output'];
  to_state?: Maybe<TaskState>;
  type: TaskActivityType;
};

export enum TaskActivityType {
  State = 'state'
}

export type TaskCreateInput = {
  bot_installation_id: Scalars['Int']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  repo_id: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type TaskItem = {
  __typename?: 'TaskItem';
  activity?: Maybe<TaskActivity>;
  actor_user?: Maybe<User>;
  bot?: Maybe<PublicBot>;
  created_at: Scalars['DateTime']['output'];
  data?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['Int']['output'];
  repo?: Maybe<Repo>;
  type: TaskItemType;
};

export enum TaskItemType {
  Activity = 'activity',
  Bot = 'bot',
  Message = 'message',
  Origin = 'origin',
  Proposal = 'proposal',
  Repo = 'repo'
}

export enum TaskState {
  Cancelled = 'cancelled',
  Completed = 'completed',
  Failed = 'failed',
  Skipped = 'skipped',
  Started = 'started',
  Submitted = 'submitted'
}

export type TasksCount = {
  __typename?: 'TasksCount';
  count: Scalars['Int']['output'];
  state: TaskState;
};

export type TasksFilter = {
  bot_id?: InputMaybe<Scalars['Int']['input']>;
  is_scheduled?: InputMaybe<Scalars['Boolean']['input']>;
  repo_id?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  providers: Array<UserProvider>;
};

export type UserProvider = {
  __typename?: 'UserProvider';
  id: Scalars['Int']['output'];
  provider_id: Scalars['String']['output'];
  provider_type: ProviderType;
};

export type UserUpdateInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

type BotBase_Bot_Fragment = { __typename?: 'Bot', id: number, name: string, short_description: string, type: BotType, image_url?: string | null, is_published: boolean, is_preview: boolean, is_deterministic: boolean } & { ' $fragmentName'?: 'BotBase_Bot_Fragment' };

type BotBase_PublicBot_Fragment = { __typename?: 'PublicBot', id: number, name: string, short_description: string, type: BotType, image_url?: string | null, is_published: boolean, is_preview: boolean, is_deterministic: boolean } & { ' $fragmentName'?: 'BotBase_PublicBot_Fragment' };

export type BotBaseFragment = BotBase_Bot_Fragment | BotBase_PublicBot_Fragment;

export type BotInstallationFragment = { __typename?: 'BotInstallation', id: number, created_at: any, bot: { __typename?: 'PublicBot', id: number, name: string, image_url?: string | null, org: { __typename?: 'PublicOrg', id: number, name: string } }, tasks_count: Array<{ __typename?: 'TasksCount', state: TaskState, count: number }> } & { ' $fragmentName'?: 'BotInstallationFragment' };

export type PublicBotFragment = (
  { __typename?: 'PublicBot', org: { __typename?: 'PublicOrg', name: string }, installation?: { __typename?: 'PublicBotInstallation', id: number } | null }
  & { ' $fragmentRefs'?: { 'BotBase_PublicBot_Fragment': BotBase_PublicBot_Fragment } }
) & { ' $fragmentName'?: 'PublicBotFragment' };

export type BotFragment = { __typename?: 'Bot', id: number, name: string, short_description: string, type: BotType, webhook_url: string, webhook_secret: string, draft_paths: Array<string>, paths: Array<string>, image_url?: string | null, description?: any | null, homepage?: string | null, is_published: boolean, is_preview: boolean, is_deterministic: boolean } & { ' $fragmentName'?: 'BotFragment' };

export type BotQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
}>;


export type BotQuery = { __typename?: 'Query', bot: (
    { __typename?: 'Bot' }
    & { ' $fragmentRefs'?: { 'BotFragment': BotFragment } }
  ) };

export type BotUpdateMutationVariables = Exact<{
  org_id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  input: BotUpdateInput;
}>;


export type BotUpdateMutation = { __typename?: 'Mutation', botUpdate: (
    { __typename?: 'Bot' }
    & { ' $fragmentRefs'?: { 'BotFragment': BotFragment } }
  ) };

export type BotPublishMutationVariables = Exact<{
  org_id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
}>;


export type BotPublishMutation = { __typename?: 'Mutation', botPublish: (
    { __typename?: 'Bot' }
    & { ' $fragmentRefs'?: { 'BotFragment': BotFragment } }
  ) };

export type BotCreateMutationVariables = Exact<{
  org_id: Scalars['Int']['input'];
  input: BotCreateInput;
}>;


export type BotCreateMutation = { __typename?: 'Mutation', botCreate: (
    { __typename?: 'Bot' }
    & { ' $fragmentRefs'?: { 'BotBase_Bot_Fragment': BotBase_Bot_Fragment } }
  ) };

export type BotInstallationBotQueryVariables = Exact<{
  org_name: Scalars['String']['input'];
  name: Scalars['String']['input'];
  org_id: Scalars['Int']['input'];
}>;


export type BotInstallationBotQuery = { __typename?: 'Query', publicBot: { __typename?: 'PublicBot', id: number, short_description: string, type: BotType, image_url?: string | null, installation?: { __typename?: 'PublicBotInstallation', id: number } | null } };

export type BotInstallationTasksQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
  bot_id: Scalars['Int']['input'];
}>;


export type BotInstallationTasksQuery = { __typename?: 'Query', tasks: Array<(
    { __typename?: 'Task', id: number }
    & { ' $fragmentRefs'?: { 'TaskFragment': TaskFragment } }
  )> };

export type BotUninstallMutationVariables = Exact<{
  org_id: Scalars['Int']['input'];
  bot_id: Scalars['Int']['input'];
}>;


export type BotUninstallMutation = { __typename?: 'Mutation', botUninstall: boolean };

export type BotInstallationsQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
}>;


export type BotInstallationsQuery = { __typename?: 'Query', botInstallations: Array<(
    { __typename?: 'BotInstallation', id: number }
    & { ' $fragmentRefs'?: { 'BotInstallationFragment': BotInstallationFragment } }
  )> };

export type BotsQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
}>;


export type BotsQuery = { __typename?: 'Query', bots: Array<(
    { __typename?: 'Bot', id: number }
    & { ' $fragmentRefs'?: { 'BotBase_Bot_Fragment': BotBase_Bot_Fragment } }
  )> };

export type PublicBotQueryVariables = Exact<{
  org_name: Scalars['String']['input'];
  name: Scalars['String']['input'];
  org_id: Scalars['Int']['input'];
}>;


export type PublicBotQuery = { __typename?: 'Query', publicBot: { __typename?: 'PublicBot', id: number, name: string, short_description: string, type: BotType, paths: Array<string>, image_url?: string | null, description?: any | null, homepage?: string | null, is_published: boolean, is_preview: boolean, is_deterministic: boolean, org: { __typename?: 'PublicOrg', name: string }, installation?: { __typename?: 'PublicBotInstallation', id: number } | null } };

export type BotInstallMutationVariables = Exact<{
  org_id: Scalars['Int']['input'];
  input: BotInstallInput;
}>;


export type BotInstallMutation = { __typename?: 'Mutation', botInstall: (
    { __typename?: 'BotInstallation' }
    & { ' $fragmentRefs'?: { 'BotInstallationFragment': BotInstallationFragment } }
  ) };

export type PublicBotsQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
  filter?: InputMaybe<PublicBotsFilter>;
}>;


export type PublicBotsQuery = { __typename?: 'Query', publicBots: Array<(
    { __typename?: 'PublicBot', id: number }
    & { ' $fragmentRefs'?: { 'PublicBotFragment': PublicBotFragment } }
  )> };

export type IntegrationSetupGithubQueryVariables = Exact<{ [key: string]: never; }>;


export type IntegrationSetupGithubQuery = { __typename?: 'Query', orgs: Array<{ __typename?: 'Org', name: string, github_installation_id?: number | null }> };

export type OrgsQueryFragment = { __typename?: 'Query', orgs: Array<{ __typename?: 'Org', id: number, name: string, provider_type: ProviderType, provider_id: string, provider_name: string, has_installation: boolean, github_installation_id?: number | null, bot_installations_count: number }> } & { ' $fragmentName'?: 'OrgsQueryFragment' };

export type IntegrationsQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
}>;


export type IntegrationsQuery = { __typename?: 'Query', integrations: Array<{ __typename?: 'Integration', id: number, type: IntegrationType, config: any, created_at: any, author: { __typename?: 'User', name: string } }> };

export type RepoFragment = { __typename?: 'Repo', id: number, name: string, is_private: boolean, is_archived: boolean, has_installation: boolean, tasks_count: Array<{ __typename?: 'TasksCount', state: TaskState, count: number }> } & { ' $fragmentName'?: 'RepoFragment' };

export type RepoQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
}>;


export type RepoQuery = { __typename?: 'Query', repo?: { __typename?: 'Repo', id: number, name: string, is_private: boolean, is_archived: boolean, has_installation: boolean } | null };

export type RepoTasksQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
  repo_id: Scalars['Int']['input'];
}>;


export type RepoTasksQuery = { __typename?: 'Query', tasks: Array<(
    { __typename?: 'Task', id: number }
    & { ' $fragmentRefs'?: { 'TaskFragment': TaskFragment } }
  )> };

export type ReposQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
}>;


export type ReposQuery = { __typename?: 'Query', repos: Array<(
    { __typename?: 'Repo', id: number }
    & { ' $fragmentRefs'?: { 'RepoFragment': RepoFragment } }
  )> };

export type TaskFragment = { __typename?: 'Task', id: number, title: string, is_scheduled: boolean, state: TaskState, created_at: any, items: Array<(
    { __typename?: 'TaskItem', type: TaskItemType }
    & { ' $fragmentRefs'?: { 'TaskItemFragment': TaskItemFragment } }
  )> } & { ' $fragmentName'?: 'TaskFragment' };

export type TaskItemFragment = { __typename?: 'TaskItem', id: number, type: TaskItemType, data?: any | null, created_at: any, actor_user?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'UserAvatarFragment': UserAvatarFragment } }
  ) | null, bot?: { __typename?: 'PublicBot', id: number, name: string, short_description: string, image_url?: string | null, org: { __typename?: 'PublicOrg', id: number, name: string } } | null, repo?: { __typename?: 'Repo', id: number, name: string, org: { __typename?: 'Org', id: number, provider_type: ProviderType, provider_name: string } } | null, activity?: { __typename?: 'TaskActivity', id: number, type: TaskActivityType, from_state?: TaskState | null, to_state?: TaskState | null } | null } & { ' $fragmentName'?: 'TaskItemFragment' };

export type TaskQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
  id: Scalars['Int']['input'];
}>;


export type TaskQuery = { __typename?: 'Query', task: (
    { __typename?: 'Task', id: number }
    & { ' $fragmentRefs'?: { 'TaskFragment': TaskFragment } }
  ) };

export type TaskCreateMutationVariables = Exact<{
  org_id: Scalars['Int']['input'];
  input: TaskCreateInput;
}>;


export type TaskCreateMutation = { __typename?: 'Mutation', taskCreate: (
    { __typename?: 'Task' }
    & { ' $fragmentRefs'?: { 'TaskFragment': TaskFragment } }
  ) };

export type BotInstallationsAsOptionsQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
}>;


export type BotInstallationsAsOptionsQuery = { __typename?: 'Query', botInstallations: Array<{ __typename?: 'BotInstallation', id: number, bot: { __typename?: 'PublicBot', id: number, name: string, image_url?: string | null, org: { __typename?: 'PublicOrg', id: number, name: string } } }> };

export type RepositoriesAsOptionsQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
}>;


export type RepositoriesAsOptionsQuery = { __typename?: 'Query', repos: Array<{ __typename?: 'Repo', id: number, name: string, has_installation: boolean }> };

export type TasksQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
  filter?: InputMaybe<TasksFilter>;
}>;


export type TasksQuery = { __typename?: 'Query', tasks: Array<(
    { __typename?: 'Task', id: number }
    & { ' $fragmentRefs'?: { 'TaskFragment': TaskFragment } }
  )> };

export type UserAvatarFragment = { __typename?: 'User', id: number, name: string, providers: Array<{ __typename?: 'UserProvider', id: number, provider_type: ProviderType, provider_id: string }> } & { ' $fragmentName'?: 'UserAvatarFragment' };

export type UserQueryFragment = { __typename?: 'Query', user: (
    { __typename?: 'User', email: string }
    & { ' $fragmentRefs'?: { 'UserAvatarFragment': UserAvatarFragment } }
  ) } & { ' $fragmentName'?: 'UserQueryFragment' };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'UserQueryFragment': UserQueryFragment } }
);

export type UserUpdateMutationVariables = Exact<{
  input: UserUpdateInput;
}>;


export type UserUpdateMutation = { __typename?: 'Mutation', userUpdate: { __typename?: 'User', id: number, name: string, email: string } };

export type DashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'UserQueryFragment': UserQueryFragment;'OrgsQueryFragment': OrgsQueryFragment } }
);

export const BotInstallationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotInstallation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotInstallation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tasks_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<BotInstallationFragment, unknown>;
export const BotBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}}]} as unknown as DocumentNode<BotBaseFragment, unknown>;
export const PublicBotFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PublicBot"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PublicBot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotBase"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"installation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}}]} as unknown as DocumentNode<PublicBotFragment, unknown>;
export const BotFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Bot"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"webhook_url"}},{"kind":"Field","name":{"kind":"Name","value":"webhook_secret"}},{"kind":"Field","name":{"kind":"Name","value":"draft_paths"}},{"kind":"Field","name":{"kind":"Name","value":"paths"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}}]} as unknown as DocumentNode<BotFragment, unknown>;
export const OrgsQueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgsQuery"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_name"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}},{"kind":"Field","name":{"kind":"Name","value":"github_installation_id"}},{"kind":"Field","name":{"kind":"Name","value":"bot_installations_count"}}]}}]}}]} as unknown as DocumentNode<OrgsQueryFragment, unknown>;
export const RepoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Repo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Repo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"is_private"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}},{"kind":"Field","name":{"kind":"Name","value":"tasks_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<RepoFragment, unknown>;
export const UserAvatarFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}}]} as unknown as DocumentNode<UserAvatarFragment, unknown>;
export const TaskItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"actor_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"repo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from_state"}},{"kind":"Field","name":{"kind":"Name","value":"to_state"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}}]} as unknown as DocumentNode<TaskItemFragment, unknown>;
export const TaskFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"is_scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"actor_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"repo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from_state"}},{"kind":"Field","name":{"kind":"Name","value":"to_state"}}]}}]}}]} as unknown as DocumentNode<TaskFragment, unknown>;
export const UserQueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserQuery"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}}]} as unknown as DocumentNode<UserQueryFragment, unknown>;
export const BotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Bot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Bot"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Bot"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"webhook_url"}},{"kind":"Field","name":{"kind":"Name","value":"webhook_secret"}},{"kind":"Field","name":{"kind":"Name","value":"draft_paths"}},{"kind":"Field","name":{"kind":"Name","value":"paths"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}}]} as unknown as DocumentNode<BotQuery, BotQueryVariables>;
export const BotUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BotUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BotUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"botUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Bot"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Bot"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"webhook_url"}},{"kind":"Field","name":{"kind":"Name","value":"webhook_secret"}},{"kind":"Field","name":{"kind":"Name","value":"draft_paths"}},{"kind":"Field","name":{"kind":"Name","value":"paths"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}}]} as unknown as DocumentNode<BotUpdateMutation, BotUpdateMutationVariables>;
export const BotPublishDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BotPublish"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"botPublish"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Bot"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Bot"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"webhook_url"}},{"kind":"Field","name":{"kind":"Name","value":"webhook_secret"}},{"kind":"Field","name":{"kind":"Name","value":"draft_paths"}},{"kind":"Field","name":{"kind":"Name","value":"paths"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}}]} as unknown as DocumentNode<BotPublishMutation, BotPublishMutationVariables>;
export const BotCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BotCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BotCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"botCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotBase"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}}]} as unknown as DocumentNode<BotCreateMutation, BotCreateMutationVariables>;
export const BotInstallationBotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BotInstallationBot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicBot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"installation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<BotInstallationBotQuery, BotInstallationBotQueryVariables>;
export const BotInstallationTasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BotInstallationTasks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bot_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tasks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"bot_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bot_id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Task"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"actor_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"repo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from_state"}},{"kind":"Field","name":{"kind":"Name","value":"to_state"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"is_scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskItem"}}]}}]}}]} as unknown as DocumentNode<BotInstallationTasksQuery, BotInstallationTasksQueryVariables>;
export const BotUninstallDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BotUninstall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bot_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"botUninstall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"bot_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bot_id"}}}]}]}}]} as unknown as DocumentNode<BotUninstallMutation, BotUninstallMutationVariables>;
export const BotInstallationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BotInstallations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"botInstallations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotInstallation"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotInstallation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotInstallation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tasks_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<BotInstallationsQuery, BotInstallationsQueryVariables>;
export const BotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Bots"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotBase"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}}]} as unknown as DocumentNode<BotsQuery, BotsQueryVariables>;
export const PublicBotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicBot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicBot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"paths"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"installation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<PublicBotQuery, PublicBotQueryVariables>;
export const BotInstallDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BotInstall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BotInstallInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"botInstall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotInstallation"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotInstallation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotInstallation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tasks_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<BotInstallMutation, BotInstallMutationVariables>;
export const PublicBotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicBots"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PublicBotsFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicBots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PublicBot"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PublicBot"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PublicBot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotBase"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"installation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<PublicBotsQuery, PublicBotsQueryVariables>;
export const IntegrationSetupGithubDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IntegrationSetupGithub"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"github_installation_id"}}]}}]}}]} as unknown as DocumentNode<IntegrationSetupGithubQuery, IntegrationSetupGithubQueryVariables>;
export const IntegrationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Integrations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"integrations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<IntegrationsQuery, IntegrationsQueryVariables>;
export const RepoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Repo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"is_private"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}}]}}]}}]} as unknown as DocumentNode<RepoQuery, RepoQueryVariables>;
export const RepoTasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RepoTasks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"repo_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tasks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"repo_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"repo_id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Task"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"actor_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"repo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from_state"}},{"kind":"Field","name":{"kind":"Name","value":"to_state"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"is_scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskItem"}}]}}]}}]} as unknown as DocumentNode<RepoTasksQuery, RepoTasksQueryVariables>;
export const ReposDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Repos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repos"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Repo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Repo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Repo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"is_private"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}},{"kind":"Field","name":{"kind":"Name","value":"tasks_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<ReposQuery, ReposQueryVariables>;
export const TaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Task"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"task"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Task"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"actor_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"repo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from_state"}},{"kind":"Field","name":{"kind":"Name","value":"to_state"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"is_scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskItem"}}]}}]}}]} as unknown as DocumentNode<TaskQuery, TaskQueryVariables>;
export const TaskCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TaskCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Task"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"actor_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"repo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from_state"}},{"kind":"Field","name":{"kind":"Name","value":"to_state"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"is_scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskItem"}}]}}]}}]} as unknown as DocumentNode<TaskCreateMutation, TaskCreateMutationVariables>;
export const BotInstallationsAsOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BotInstallationsAsOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"botInstallations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"manual"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BotInstallationsAsOptionsQuery, BotInstallationsAsOptionsQueryVariables>;
export const RepositoriesAsOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RepositoriesAsOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repos"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_archived"},"value":{"kind":"BooleanValue","value":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}}]}}]}}]} as unknown as DocumentNode<RepositoriesAsOptionsQuery, RepositoriesAsOptionsQueryVariables>;
export const TasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Tasks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TasksFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tasks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Task"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"actor_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"repo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from_state"}},{"kind":"Field","name":{"kind":"Name","value":"to_state"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"is_scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskItem"}}]}}]}}]} as unknown as DocumentNode<TasksQuery, TasksQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserQuery"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserQuery"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const UserUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UserUpdateMutation, UserUpdateMutationVariables>;
export const DashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Dashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserQuery"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrgsQuery"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserQuery"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgsQuery"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_name"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}},{"kind":"Field","name":{"kind":"Name","value":"github_installation_id"}},{"kind":"Field","name":{"kind":"Name","value":"bot_installations_count"}}]}}]}}]} as unknown as DocumentNode<DashboardQuery, DashboardQueryVariables>;