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

export enum CompetitorType {
  Dependabot = 'dependabot',
  Renovate = 'renovate'
}

export type Org = {
  __typename?: 'Org';
  created_at: Scalars['DateTime']['output'];
  github_installation_id?: Maybe<Scalars['Int']['output']>;
  has_installation: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  is_user: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  project_integration_connections: Array<ProjectIntegrationConnection>;
  provider_id: Scalars['String']['output'];
  provider_type: ProviderType;
  repos: Array<Repo>;
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
  org?: Maybe<Org>;
  orgs: Array<Org>;
  repo?: Maybe<Repo>;
};


export type QueryOrgArgs = {
  name: Scalars['String']['input'];
  provider_type: ProviderType;
};


export type QueryRepoArgs = {
  name: Scalars['String']['input'];
  org_name: Scalars['String']['input'];
  provider_type: ProviderType;
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

export type User = {
  __typename?: 'User';
  name: Scalars['String']['output'];
};

export type GetOrgQueryVariables = Exact<{
  provider_type: ProviderType;
  name: Scalars['String']['input'];
}>;


export type GetOrgQuery = { __typename?: 'Query', org?: { __typename?: 'Org', id: number, name: string, provider_type: ProviderType, github_installation_id?: number | null, repos: Array<{ __typename?: 'Repo', id: number, name: string, is_private: boolean, is_archived: boolean, has_installation: boolean }> } | null };

export type GetOrgsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrgsQuery = { __typename?: 'Query', orgs: Array<{ __typename?: 'Org', id: number, name: string, provider_type: ProviderType, has_installation: boolean }> };

export type GetOrgIntegrationsQueryVariables = Exact<{
  provider_type: ProviderType;
  name: Scalars['String']['input'];
}>;


export type GetOrgIntegrationsQuery = { __typename?: 'Query', org?: { __typename?: 'Org', id: number, name: string, provider_type: ProviderType, project_integration_connections: Array<{ __typename?: 'ProjectIntegrationConnection', id: number, name: string, provider_type: ProjectProviderType, config: any, created_at: any, author: { __typename?: 'User', name: string } }> } | null };

export type GetRepoQueryVariables = Exact<{
  provider_type: ProviderType;
  org_name: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type GetRepoQuery = { __typename?: 'Query', repo?: { __typename?: 'Repo', id: number, name: string, provider_id: string, is_private: boolean, is_archived: boolean, has_installation: boolean, org: { __typename?: 'Org', id: number, name: string, github_installation_id?: number | null } } | null };


export const GetOrgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrg"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provider_type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProviderType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"provider_type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provider_type"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"github_installation_id"}},{"kind":"Field","name":{"kind":"Name","value":"repos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"is_private"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrgQuery, GetOrgQueryVariables>;
export const GetOrgsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}}]}}]}}]} as unknown as DocumentNode<GetOrgsQuery, GetOrgsQueryVariables>;
export const GetOrgIntegrationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrgIntegrations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provider_type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProviderType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"provider_type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provider_type"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"project_integration_connections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_type"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrgIntegrationsQuery, GetOrgIntegrationsQueryVariables>;
export const GetRepoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRepo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provider_type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProviderType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"provider_type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provider_type"}}},{"kind":"Argument","name":{"kind":"Name","value":"org_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_name"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider_id"}},{"kind":"Field","name":{"kind":"Name","value":"is_private"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"has_installation"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"github_installation_id"}}]}}]}}]}}]} as unknown as DocumentNode<GetRepoQuery, GetRepoQueryVariables>;