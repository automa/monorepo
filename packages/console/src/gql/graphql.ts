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
  description?: Maybe<Scalars['String']['output']>;
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  is_deterministic: Scalars['Boolean']['output'];
  is_preview: Scalars['Boolean']['output'];
  is_published: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  org: Org;
  published_at?: Maybe<Scalars['DateTime']['output']>;
  short_description: Scalars['String']['output'];
  type: BotType;
  webhook_secret: Scalars['String']['output'];
  webhook_url: Scalars['String']['output'];
};

export type BotBase = {
  description?: Maybe<Scalars['String']['output']>;
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  is_deterministic: Scalars['Boolean']['output'];
  is_preview: Scalars['Boolean']['output'];
  is_published: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  short_description: Scalars['String']['output'];
  type: BotType;
};

export type BotCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
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
  org: PublicOrg;
};

export enum BotType {
  Event = 'event',
  Scheduled = 'scheduled'
}

export type Integration = {
  __typename?: 'Integration';
  author: User;
  config: Scalars['JSON']['output'];
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  integration_type: IntegrationType;
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
  botUninstall: Scalars['Boolean']['output'];
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


export type MutationBotUninstallArgs = {
  bot_id: Scalars['Int']['input'];
  org_id: Scalars['Int']['input'];
};


export type MutationTaskCreateArgs = {
  input: TaskMessageInput;
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
  description?: Maybe<Scalars['String']['output']>;
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  installation?: Maybe<BotInstallation>;
  is_deterministic: Scalars['Boolean']['output'];
  is_preview: Scalars['Boolean']['output'];
  is_published: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  org: PublicOrg;
  short_description: Scalars['String']['output'];
  type: BotType;
};


export type PublicBotInstallationArgs = {
  org_id: Scalars['Int']['input'];
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
  botInstallations: Array<BotInstallation>;
  bots: Array<Bot>;
  integrations: Array<Integration>;
  me: User;
  orgs: Array<Org>;
  publicBot: PublicBot;
  publicBots: Array<PublicBot>;
  repo?: Maybe<Repo>;
  repos: Array<Repo>;
  task: Task;
  tasks: Array<Task>;
};


export type QueryBotInstallationsArgs = {
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
  org_name: Scalars['String']['input'];
};


export type QueryReposArgs = {
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
};

export type Task = {
  __typename?: 'Task';
  completed_at?: Maybe<Scalars['DateTime']['output']>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  is_completed: Scalars['Boolean']['output'];
  is_scheduled: Scalars['Boolean']['output'];
  items: Array<TaskItem>;
  org: Org;
  title: Scalars['String']['output'];
};

export type TaskItem = {
  __typename?: 'TaskItem';
  actor_user?: Maybe<User>;
  created_at: Scalars['DateTime']['output'];
  data?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['Int']['output'];
  type: TaskItemType;
};

export enum TaskItemType {
  Bot = 'bot',
  Message = 'message',
  Origin = 'origin',
  PullRequest = 'pull_request',
  Repo = 'repo'
}

export type TaskMessageInput = {
  content: Scalars['String']['input'];
};

export type TasksFilter = {
  is_scheduled?: InputMaybe<Scalars['Boolean']['input']>;
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

export type BotFragment = (
  { __typename?: 'Bot', id: number }
  & { ' $fragmentRefs'?: { 'BotBase_Bot_Fragment': BotBase_Bot_Fragment } }
) & { ' $fragmentName'?: 'BotFragment' };

type BotBase_Bot_Fragment = { __typename?: 'Bot', name: string, short_description: string, image_url?: string | null, type: BotType, is_published: boolean, is_preview: boolean, is_deterministic: boolean } & { ' $fragmentName'?: 'BotBase_Bot_Fragment' };

type BotBase_PublicBot_Fragment = { __typename?: 'PublicBot', name: string, short_description: string, image_url?: string | null, type: BotType, is_published: boolean, is_preview: boolean, is_deterministic: boolean } & { ' $fragmentName'?: 'BotBase_PublicBot_Fragment' };

export type BotBaseFragment = BotBase_Bot_Fragment | BotBase_PublicBot_Fragment;

export type BotInstallationFragment = { __typename?: 'BotInstallation', id: number, created_at: any, bot: { __typename?: 'PublicBot', name: string, org: { __typename?: 'PublicOrg', provider_type: ProviderType, name: string } } } & { ' $fragmentName'?: 'BotInstallationFragment' };

export type PublicBotFragment = (
  { __typename?: 'PublicBot', id: number, org: { __typename?: 'PublicOrg', name: string }, installation?: { __typename?: 'BotInstallation', id: number } | null }
  & { ' $fragmentRefs'?: { 'BotBase_PublicBot_Fragment': BotBase_PublicBot_Fragment } }
) & { ' $fragmentName'?: 'PublicBotFragment' };

export type BotCreateMutationVariables = Exact<{
  org_id: Scalars['Int']['input'];
  input: BotCreateInput;
}>;


export type BotCreateMutation = { __typename?: 'Mutation', botCreate: (
    { __typename?: 'Bot' }
    & { ' $fragmentRefs'?: { 'BotFragment': BotFragment } }
  ) };

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
    & { ' $fragmentRefs'?: { 'BotFragment': BotFragment } }
  )> };

export type PublicBotQueryVariables = Exact<{
  org_name: Scalars['String']['input'];
  name: Scalars['String']['input'];
  org_id: Scalars['Int']['input'];
}>;


export type PublicBotQuery = { __typename?: 'Query', publicBot: { __typename?: 'PublicBot', id: number, name: string, short_description: string, image_url?: string | null, type: BotType, description?: string | null, homepage?: string | null, is_published: boolean, is_preview: boolean, is_deterministic: boolean, org: { __typename?: 'PublicOrg', name: string }, installation?: { __typename?: 'BotInstallation', id: number } | null } };

export type BotInstallMutationVariables = Exact<{
  org_id: Scalars['Int']['input'];
  input: BotInstallInput;
}>;


export type BotInstallMutation = { __typename?: 'Mutation', botInstall: (
    { __typename?: 'BotInstallation' }
    & { ' $fragmentRefs'?: { 'BotInstallationFragment': BotInstallationFragment } }
  ) };

export type BotUninstallMutationVariables = Exact<{
  org_id: Scalars['Int']['input'];
  bot_id: Scalars['Int']['input'];
}>;


export type BotUninstallMutation = { __typename?: 'Mutation', botUninstall: boolean };

export type PublicBotsQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
  filter?: InputMaybe<PublicBotsFilter>;
}>;


export type PublicBotsQuery = { __typename?: 'Query', publicBots: Array<(
    { __typename?: 'PublicBot', id: number }
    & { ' $fragmentRefs'?: { 'PublicBotFragment': PublicBotFragment } }
  )> };

export type OrgsQueryFragment = { __typename?: 'Query', orgs: Array<{ __typename?: 'Org', id: number, name: string, provider_type: ProviderType, provider_id: string, provider_name: string, has_installation: boolean, bot_installations_count: number }> } & { ' $fragmentName'?: 'OrgsQueryFragment' };

export type IntegrationsQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
}>;


export type IntegrationsQuery = { __typename?: 'Query', integrations: Array<{ __typename?: 'Integration', id: number, integration_type: IntegrationType, config: any, created_at: any, author: { __typename?: 'User', name: string } }> };

export type RepoFragment = { __typename?: 'Repo', id: number, name: string, is_private: boolean, is_archived: boolean, has_installation: boolean } & { ' $fragmentName'?: 'RepoFragment' };

export type RepoQueryVariables = Exact<{
  org_name: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type RepoQuery = { __typename?: 'Query', repo?: { __typename?: 'Repo', id: number, name: string, provider_id: string, is_private: boolean, is_archived: boolean, has_installation: boolean, org: { __typename?: 'Org', id: number, name: string, provider_type: ProviderType, github_installation_id?: number | null } } | null };

export type ReposQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
}>;


export type ReposQuery = { __typename?: 'Query', repos: Array<(
    { __typename?: 'Repo', id: number }
    & { ' $fragmentRefs'?: { 'RepoFragment': RepoFragment } }
  )> };

export type TaskFragment = { __typename?: 'Task', id: number, title: string, is_scheduled: boolean, created_at: any, completed_at?: any | null, is_completed: boolean, items: Array<(
    { __typename?: 'TaskItem' }
    & { ' $fragmentRefs'?: { 'TaskItemFragment': TaskItemFragment } }
  )> } & { ' $fragmentName'?: 'TaskFragment' };

export type TaskItemFragment = { __typename?: 'TaskItem', id: number, type: TaskItemType, data?: any | null, created_at: any, actor_user?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'UserAvatarFragment': UserAvatarFragment } }
  ) | null } & { ' $fragmentName'?: 'TaskItemFragment' };

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
  input: TaskMessageInput;
}>;


export type TaskCreateMutation = { __typename?: 'Mutation', taskCreate: (
    { __typename?: 'Task' }
    & { ' $fragmentRefs'?: { 'TaskFragment': TaskFragment } }
  ) };

export type TasksQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
  filter?: InputMaybe<TasksFilter>;
}>;


export type TasksQuery = { __typename?: 'Query', tasks: Array<(
    { __typename?: 'Task', id: number }
    & { ' $fragmentRefs'?: { 'TaskFragment': TaskFragment } }
  )> };

export type UserAvatarFragment = { __typename?: 'User', id: number, name: string, providers: Array<{ __typename?: 'UserProvider', id: number, provider_type: ProviderType, provider_id: string }> } & { ' $fragmentName'?: 'UserAvatarFragment' };

export type MeQueryFragment = { __typename?: 'Query', me: (
    { __typename?: 'User', email: string }
    & { ' $fragmentRefs'?: { 'UserAvatarFragment': UserAvatarFragment } }
  ) } & { ' $fragmentName'?: 'MeQueryFragment' };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'MeQueryFragment': MeQueryFragment } }
);

export type UserUpdateMutationVariables = Exact<{
  input: UserUpdateInput;
}>;


export type UserUpdateMutation = { __typename?: 'Mutation', userUpdate: { __typename?: 'User', id: number, name: string, email: string } };

export type DashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'MeQueryFragment': MeQueryFragment;'OrgsQueryFragment': OrgsQueryFragment } }
);

export const BotBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}}]} as unknown as DocumentNode<BotBaseFragment, unknown>;
export const BotFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Bot"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotBase"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}}]} as unknown as DocumentNode<BotFragment, unknown>;
export const BotInstallationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotInstallation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotInstallation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<BotInstallationFragment, unknown>;
export const PublicBotFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PublicBot"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PublicBot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotBase"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"installation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}}]} as unknown as DocumentNode<PublicBotFragment, unknown>;
export const OrgsQueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgsQuery"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_name"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}},{"kind":"Field","name":{"kind":"Name","value":"bot_installations_count"}}]}}]}}]} as unknown as DocumentNode<OrgsQueryFragment, unknown>;
export const RepoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Repo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Repo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"is_private"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}}]}}]} as unknown as DocumentNode<RepoFragment, unknown>;
export const UserAvatarFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}}]} as unknown as DocumentNode<UserAvatarFragment, unknown>;
export const TaskItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"actor_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}}]} as unknown as DocumentNode<TaskItemFragment, unknown>;
export const TaskFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"is_scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"completed_at"}},{"kind":"Field","name":{"kind":"Name","value":"is_completed"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"actor_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}}]}}]} as unknown as DocumentNode<TaskFragment, unknown>;
export const MeQueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeQuery"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}}]} as unknown as DocumentNode<MeQueryFragment, unknown>;
export const BotCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BotCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BotCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"botCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Bot"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Bot"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotBase"}}]}}]} as unknown as DocumentNode<BotCreateMutation, BotCreateMutationVariables>;
export const BotInstallationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BotInstallations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"botInstallations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotInstallation"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotInstallation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotInstallation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<BotInstallationsQuery, BotInstallationsQueryVariables>;
export const BotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Bots"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Bot"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Bot"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotBase"}}]}}]} as unknown as DocumentNode<BotsQuery, BotsQueryVariables>;
export const PublicBotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicBot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicBot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"installation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<PublicBotQuery, PublicBotQueryVariables>;
export const BotInstallDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BotInstall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BotInstallInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"botInstall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotInstallation"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotInstallation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotInstallation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<BotInstallMutation, BotInstallMutationVariables>;
export const BotUninstallDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BotUninstall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bot_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"botUninstall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"bot_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bot_id"}}}]}]}}]} as unknown as DocumentNode<BotUninstallMutation, BotUninstallMutationVariables>;
export const PublicBotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicBots"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PublicBotsFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicBots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PublicBot"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"short_description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"is_preview"}},{"kind":"Field","name":{"kind":"Name","value":"is_deterministic"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PublicBot"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PublicBot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotBase"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"installation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<PublicBotsQuery, PublicBotsQueryVariables>;
export const IntegrationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Integrations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"integrations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"integration_type"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<IntegrationsQuery, IntegrationsQueryVariables>;
export const RepoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Repo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"is_private"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"github_installation_id"}}]}}]}}]}}]} as unknown as DocumentNode<RepoQuery, RepoQueryVariables>;
export const ReposDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Repos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repos"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Repo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Repo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Repo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"is_private"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}}]}}]} as unknown as DocumentNode<ReposQuery, ReposQueryVariables>;
export const TaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Task"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"task"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Task"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"actor_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"is_scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"completed_at"}},{"kind":"Field","name":{"kind":"Name","value":"is_completed"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskItem"}}]}}]}}]} as unknown as DocumentNode<TaskQuery, TaskQueryVariables>;
export const TaskCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TaskCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskMessageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Task"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"actor_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"is_scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"completed_at"}},{"kind":"Field","name":{"kind":"Name","value":"is_completed"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskItem"}}]}}]}}]} as unknown as DocumentNode<TaskCreateMutation, TaskCreateMutationVariables>;
export const TasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Tasks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TasksFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tasks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Task"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaskItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"actor_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"is_scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"completed_at"}},{"kind":"Field","name":{"kind":"Name","value":"is_completed"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskItem"}}]}}]}}]} as unknown as DocumentNode<TasksQuery, TasksQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeQuery"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeQuery"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const UserUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UserUpdateMutation, UserUpdateMutationVariables>;
export const DashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Dashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeQuery"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrgsQuery"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAvatar"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeQuery"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAvatar"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgsQuery"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_name"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}},{"kind":"Field","name":{"kind":"Name","value":"bot_installations_count"}}]}}]}}]} as unknown as DocumentNode<DashboardQuery, DashboardQueryVariables>;