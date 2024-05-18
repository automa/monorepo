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

export type Bot = {
  __typename?: 'Bot';
  created_at: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  is_published: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  org: Org;
  published_at?: Maybe<Scalars['DateTime']['output']>;
  type: BotType;
  webhook_url?: Maybe<Scalars['String']['output']>;
};

export type BotCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  type: BotType;
  webhook_url?: InputMaybe<Scalars['String']['input']>;
};

export type BotInstallation = {
  __typename?: 'BotInstallation';
  bot: Bot;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  org: Org;
};

export enum BotType {
  Webhook = 'webhook'
}

export type Mutation = {
  __typename?: 'Mutation';
  botCreate: Bot;
  taskCreate: Task;
};


export type MutationBotCreateArgs = {
  input: BotCreateInput;
  org_id: Scalars['Int']['input'];
};


export type MutationTaskCreateArgs = {
  input: TaskMessageInput;
  org_id: Scalars['Int']['input'];
};

export type Org = {
  __typename?: 'Org';
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

export type ProjectIntegrationConnection = {
  __typename?: 'ProjectIntegrationConnection';
  author: User;
  config: Scalars['JSON']['output'];
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  provider_type: ProjectProviderType;
};

export enum ProjectProviderType {
  Github = 'github',
  Linear = 'linear'
}

export enum ProviderType {
  Github = 'github',
  Gitlab = 'gitlab'
}

export type Query = {
  __typename?: 'Query';
  botInstallations: Array<BotInstallation>;
  bots: Array<Bot>;
  me: User;
  orgs: Array<Org>;
  project_integration_connections: Array<ProjectIntegrationConnection>;
  repo?: Maybe<Repo>;
  repos: Array<Repo>;
  tasks: Array<Task>;
};


export type QueryBotInstallationsArgs = {
  org_id: Scalars['Int']['input'];
};


export type QueryBotsArgs = {
  org_id: Scalars['Int']['input'];
};


export type QueryProject_Integration_ConnectionsArgs = {
  org_id: Scalars['Int']['input'];
};


export type QueryRepoArgs = {
  name: Scalars['String']['input'];
  org_name: Scalars['String']['input'];
};


export type QueryReposArgs = {
  org_id: Scalars['Int']['input'];
};


export type QueryTasksArgs = {
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
  author?: Maybe<User>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  org: Org;
  title: Scalars['String']['output'];
};

export type TaskMessageInput = {
  content: Scalars['String']['input'];
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

export type BotFragmentFragment = { __typename?: 'Bot', id: number, name: string, description?: string | null, type: BotType, webhook_url?: string | null, homepage?: string | null, published_at?: any | null, is_published: boolean, created_at: any } & { ' $fragmentName'?: 'BotFragmentFragment' };

export type BotInstallationFragmentFragment = { __typename?: 'BotInstallation', id: number, created_at: any, bot: { __typename?: 'Bot', name: string, org: { __typename?: 'Org', provider_type: ProviderType, name: string } } } & { ' $fragmentName'?: 'BotInstallationFragmentFragment' };

export type BotCreateMutationVariables = Exact<{
  org_id: Scalars['Int']['input'];
  input: BotCreateInput;
}>;


export type BotCreateMutation = { __typename?: 'Mutation', botCreate: (
    { __typename?: 'Bot' }
    & { ' $fragmentRefs'?: { 'BotFragmentFragment': BotFragmentFragment } }
  ) };

export type BotInstallationsQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
}>;


export type BotInstallationsQuery = { __typename?: 'Query', botInstallations: Array<(
    { __typename?: 'BotInstallation', id: number }
    & { ' $fragmentRefs'?: { 'BotInstallationFragmentFragment': BotInstallationFragmentFragment } }
  )> };

export type BotsQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
}>;


export type BotsQuery = { __typename?: 'Query', bots: Array<(
    { __typename?: 'Bot', id: number }
    & { ' $fragmentRefs'?: { 'BotFragmentFragment': BotFragmentFragment } }
  )> };

export type OrgsQueryFragmentFragment = { __typename?: 'Query', orgs: Array<{ __typename?: 'Org', id: number, name: string, provider_type: ProviderType, provider_id: string, provider_name: string, has_installation: boolean }> } & { ' $fragmentName'?: 'OrgsQueryFragmentFragment' };

export type IntegrationConnectionsQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
}>;


export type IntegrationConnectionsQuery = { __typename?: 'Query', project_integration_connections: Array<{ __typename?: 'ProjectIntegrationConnection', id: number, name: string, provider_type: ProjectProviderType, config: any, created_at: any, author: { __typename?: 'User', name: string } }> };

export type RepoFragmentFragment = { __typename?: 'Repo', id: number, name: string, is_private: boolean, is_archived: boolean, has_installation: boolean } & { ' $fragmentName'?: 'RepoFragmentFragment' };

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
    & { ' $fragmentRefs'?: { 'RepoFragmentFragment': RepoFragmentFragment } }
  )> };

export type TaskFragmentFragment = { __typename?: 'Task', id: number, title: string, created_at: any, author?: { __typename?: 'User', id: number, name: string, providers: Array<{ __typename?: 'UserProvider', id: number, provider_type: ProviderType, provider_id: string }> } | null } & { ' $fragmentName'?: 'TaskFragmentFragment' };

export type TaskCreateMutationVariables = Exact<{
  org_id: Scalars['Int']['input'];
  input: TaskMessageInput;
}>;


export type TaskCreateMutation = { __typename?: 'Mutation', taskCreate: (
    { __typename?: 'Task' }
    & { ' $fragmentRefs'?: { 'TaskFragmentFragment': TaskFragmentFragment } }
  ) };

export type TasksQueryVariables = Exact<{
  org_id: Scalars['Int']['input'];
}>;


export type TasksQuery = { __typename?: 'Query', tasks: Array<(
    { __typename?: 'Task', id: number }
    & { ' $fragmentRefs'?: { 'TaskFragmentFragment': TaskFragmentFragment } }
  )> };

export type MeQueryFragmentFragment = { __typename?: 'Query', me: { __typename?: 'User', id: number, name: string, email: string, providers: Array<{ __typename?: 'UserProvider', id: number, provider_type: ProviderType, provider_id: string }> } } & { ' $fragmentName'?: 'MeQueryFragmentFragment' };

export type DashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'MeQueryFragmentFragment': MeQueryFragmentFragment;'OrgsQueryFragmentFragment': OrgsQueryFragmentFragment } }
);

export const BotFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"webhook_url"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]} as unknown as DocumentNode<BotFragmentFragment, unknown>;
export const BotInstallationFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotInstallationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotInstallation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<BotInstallationFragmentFragment, unknown>;
export const OrgsQueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgsQueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_name"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}}]}}]}}]} as unknown as DocumentNode<OrgsQueryFragmentFragment, unknown>;
export const RepoFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RepoFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Repo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"is_private"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}}]}}]} as unknown as DocumentNode<RepoFragmentFragment, unknown>;
export const TaskFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}}]}}]} as unknown as DocumentNode<TaskFragmentFragment, unknown>;
export const MeQueryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeQueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}}]}}]} as unknown as DocumentNode<MeQueryFragmentFragment, unknown>;
export const BotCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BotCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BotCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"botCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"webhook_url"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]} as unknown as DocumentNode<BotCreateMutation, BotCreateMutationVariables>;
export const BotInstallationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BotInstallations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"botInstallations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotInstallationFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotInstallationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BotInstallation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<BotInstallationsQuery, BotInstallationsQueryVariables>;
export const BotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Bots"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BotFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BotFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"webhook_url"}},{"kind":"Field","name":{"kind":"Name","value":"homepage"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]} as unknown as DocumentNode<BotsQuery, BotsQueryVariables>;
export const IntegrationConnectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IntegrationConnections"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project_integration_connections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<IntegrationConnectionsQuery, IntegrationConnectionsQueryVariables>;
export const RepoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Repo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"is_private"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"github_installation_id"}}]}}]}}]}}]} as unknown as DocumentNode<RepoQuery, RepoQueryVariables>;
export const ReposDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Repos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repos"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RepoFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RepoFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Repo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"is_private"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}}]}}]} as unknown as DocumentNode<ReposQuery, ReposQueryVariables>;
export const TaskCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TaskCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskMessageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}}]}}]} as unknown as DocumentNode<TaskCreateMutation, TaskCreateMutationVariables>;
export const TasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Tasks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tasks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"org_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}}]}}]} as unknown as DocumentNode<TasksQuery, TasksQueryVariables>;
export const DashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Dashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeQueryFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrgsQueryFragment"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeQueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgsQueryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"provider_name"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}}]}}]}}]} as unknown as DocumentNode<DashboardQuery, DashboardQueryVariables>;