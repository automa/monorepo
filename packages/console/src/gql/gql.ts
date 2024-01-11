/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  fragment OrgsQueryFragment on Query {\n    orgs {\n      id\n      name\n      provider_type\n      has_installation\n    }\n  }\n": types.OrgsQueryFragmentFragmentDoc,
    "\n  query Org($provider_type: ProviderType!, $name: String!) {\n    org(provider_type: $provider_type, name: $name) {\n      id\n      name\n      provider_type\n    }\n  }\n": types.OrgDocument,
    "\n  query IntegrationConnections($provider_type: ProviderType!, $name: String!) {\n    org(provider_type: $provider_type, name: $name) {\n      project_integration_connections {\n        id\n        name\n        provider_type\n        config\n        created_at\n        author {\n          name\n        }\n      }\n    }\n  }\n": types.IntegrationConnectionsDocument,
    "\n  query Repos($provider_type: ProviderType!, $name: String!) {\n    org(provider_type: $provider_type, name: $name) {\n      repos {\n        id\n        name\n        is_private\n        is_archived\n        has_installation\n      }\n    }\n  }\n": types.ReposDocument,
    "\n  query Repo(\n    $provider_type: ProviderType!\n    $org_name: String!\n    $name: String!\n  ) {\n    repo(provider_type: $provider_type, org_name: $org_name, name: $name) {\n      id\n      name\n      provider_id\n      is_private\n      is_archived\n      has_installation\n      org {\n        id\n        name\n        provider_type\n        github_installation_id\n      }\n    }\n  }\n": types.RepoDocument,
    "\n  fragment MeQueryFragment on Query {\n    me {\n      id\n      name\n      email\n    }\n  }\n": types.MeQueryFragmentFragmentDoc,
    "\n  query Dashboard {\n    ...OrgsQueryFragment\n    ...MeQueryFragment\n  }\n": types.DashboardDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment OrgsQueryFragment on Query {\n    orgs {\n      id\n      name\n      provider_type\n      has_installation\n    }\n  }\n"): (typeof documents)["\n  fragment OrgsQueryFragment on Query {\n    orgs {\n      id\n      name\n      provider_type\n      has_installation\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Org($provider_type: ProviderType!, $name: String!) {\n    org(provider_type: $provider_type, name: $name) {\n      id\n      name\n      provider_type\n    }\n  }\n"): (typeof documents)["\n  query Org($provider_type: ProviderType!, $name: String!) {\n    org(provider_type: $provider_type, name: $name) {\n      id\n      name\n      provider_type\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query IntegrationConnections($provider_type: ProviderType!, $name: String!) {\n    org(provider_type: $provider_type, name: $name) {\n      project_integration_connections {\n        id\n        name\n        provider_type\n        config\n        created_at\n        author {\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query IntegrationConnections($provider_type: ProviderType!, $name: String!) {\n    org(provider_type: $provider_type, name: $name) {\n      project_integration_connections {\n        id\n        name\n        provider_type\n        config\n        created_at\n        author {\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Repos($provider_type: ProviderType!, $name: String!) {\n    org(provider_type: $provider_type, name: $name) {\n      repos {\n        id\n        name\n        is_private\n        is_archived\n        has_installation\n      }\n    }\n  }\n"): (typeof documents)["\n  query Repos($provider_type: ProviderType!, $name: String!) {\n    org(provider_type: $provider_type, name: $name) {\n      repos {\n        id\n        name\n        is_private\n        is_archived\n        has_installation\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Repo(\n    $provider_type: ProviderType!\n    $org_name: String!\n    $name: String!\n  ) {\n    repo(provider_type: $provider_type, org_name: $org_name, name: $name) {\n      id\n      name\n      provider_id\n      is_private\n      is_archived\n      has_installation\n      org {\n        id\n        name\n        provider_type\n        github_installation_id\n      }\n    }\n  }\n"): (typeof documents)["\n  query Repo(\n    $provider_type: ProviderType!\n    $org_name: String!\n    $name: String!\n  ) {\n    repo(provider_type: $provider_type, org_name: $org_name, name: $name) {\n      id\n      name\n      provider_id\n      is_private\n      is_archived\n      has_installation\n      org {\n        id\n        name\n        provider_type\n        github_installation_id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment MeQueryFragment on Query {\n    me {\n      id\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  fragment MeQueryFragment on Query {\n    me {\n      id\n      name\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Dashboard {\n    ...OrgsQueryFragment\n    ...MeQueryFragment\n  }\n"): (typeof documents)["\n  query Dashboard {\n    ...OrgsQueryFragment\n    ...MeQueryFragment\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;