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
    "\n  fragment BotFragment on Bot {\n    id\n    name\n    short_description\n    image_url\n    type\n    is_published\n    is_preview\n    is_deterministic\n  }\n": types.BotFragmentFragmentDoc,
    "\n  fragment BotInstallationFragment on BotInstallation {\n    id\n    created_at\n    bot {\n      name\n      org {\n        provider_type\n        name\n      }\n    }\n  }\n": types.BotInstallationFragmentFragmentDoc,
    "\n  fragment PublicBotFragment on PublicBot {\n    id\n    name\n    short_description\n    image_url\n    is_published\n    is_preview\n    is_deterministic\n    org {\n      name\n    }\n    installation(org_id: $org_id) {\n      id\n    }\n  }\n": types.PublicBotFragmentFragmentDoc,
    "\n  mutation BotCreate($org_id: Int!, $input: BotCreateInput!) {\n    botCreate(org_id: $org_id, input: $input) {\n      ...BotFragment\n    }\n  }\n": types.BotCreateDocument,
    "\n  query BotInstallations($org_id: Int!) {\n    botInstallations(org_id: $org_id) {\n      id\n      ...BotInstallationFragment\n    }\n  }\n": types.BotInstallationsDocument,
    "\n  query Bots($org_id: Int!) {\n    bots(org_id: $org_id) {\n      id\n      ...BotFragment\n    }\n  }\n": types.BotsDocument,
    "\n  query PublicBot(\n    $org_name: String!\n    $name: String!\n    $org_id: Int!\n  ) {\n    publicBot(org_name: $org_name, name: $name) {\n      id\n      name\n      short_description\n      image_url\n      description\n      homepage\n      is_published\n      is_preview\n      is_deterministic\n      org {\n        name\n      }\n      installation(org_id: $org_id) {\n        id\n      }\n    }\n  }\n": types.PublicBotDocument,
    "\n  mutation BotInstall($org_id: Int!, $input: BotInstallInput!) {\n    botInstall(org_id: $org_id, input: $input) {\n      ...BotInstallationFragment\n    }\n  }\n": types.BotInstallDocument,
    "\n  mutation BotUninstall($org_id: Int!, $bot_id: Int!) {\n    botUninstall(org_id: $org_id, bot_id: $bot_id)\n  }\n": types.BotUninstallDocument,
    "\n  query PublicBots($org_id: Int!, $filter: PublicBotsFilter) {\n    publicBots(filter: $filter) {\n      id\n      ...PublicBotFragment\n    }\n  }\n": types.PublicBotsDocument,
    "\n  fragment OrgsQueryFragment on Query {\n    orgs {\n      id\n      name\n      provider_type\n      provider_id\n      provider_name\n      has_installation\n\n      botInstallationsCount\n    }\n  }\n": types.OrgsQueryFragmentFragmentDoc,
    "\n  query Integrations($org_id: Int!) {\n    integrations(org_id: $org_id) {\n      id\n      integration_type\n      config\n      created_at\n      author {\n        name\n      }\n    }\n  }\n": types.IntegrationsDocument,
    "\n  fragment RepoFragment on Repo {\n    id\n    name\n    is_private\n    is_archived\n    has_installation\n  }\n": types.RepoFragmentFragmentDoc,
    "\n  query Repo(\n    $org_name: String!\n    $name: String!\n  ) {\n    repo(org_name: $org_name, name: $name) {\n      id\n      name\n      provider_id\n      is_private\n      is_archived\n      has_installation\n      org {\n        id\n        name\n        provider_type\n        github_installation_id\n      }\n    }\n  }\n": types.RepoDocument,
    "\n  query Repos($org_id: Int!) {\n    repos(org_id: $org_id) {\n      id\n      ...RepoFragment\n    }\n  }\n": types.ReposDocument,
    "\n  fragment TaskFragment on Task {\n    id\n    title\n    created_at\n    completed_at\n    is_completed\n    author {\n      ...UserAvatarFragment\n    }\n    items {\n      id\n      type\n      created_at\n      content\n      origin\n      pull_request\n    }\n  }\n": types.TaskFragmentFragmentDoc,
    "\n  mutation TaskCreate($org_id: Int!, $input: TaskMessageInput!) {\n    taskCreate(org_id: $org_id, input: $input) {\n      ...TaskFragment\n    }\n  }\n": types.TaskCreateDocument,
    "\n  query Tasks($org_id: Int!) {\n    tasks(org_id: $org_id) {\n      id\n      ...TaskFragment\n    }\n  }\n": types.TasksDocument,
    "\n  fragment UserAvatarFragment on User {\n    id\n    name\n    providers {\n      id\n      provider_type\n      provider_id\n    }\n  }\n": types.UserAvatarFragmentFragmentDoc,
    "\n  fragment MeQueryFragment on Query {\n    me {\n      email\n      ...UserAvatarFragment\n    }\n  }\n": types.MeQueryFragmentFragmentDoc,
    "\n  query Me {\n    ...MeQueryFragment\n  }\n": types.MeDocument,
    "\n  mutation UserUpdate($input: UserUpdateInput!) {\n    userUpdate(input: $input) {\n      id\n      name\n      email\n    }\n  }\n": types.UserUpdateDocument,
    "\n  query Dashboard {\n    ...MeQueryFragment\n    ...OrgsQueryFragment\n  }\n": types.DashboardDocument,
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
export function gql(source: "\n  fragment BotFragment on Bot {\n    id\n    name\n    short_description\n    image_url\n    type\n    is_published\n    is_preview\n    is_deterministic\n  }\n"): (typeof documents)["\n  fragment BotFragment on Bot {\n    id\n    name\n    short_description\n    image_url\n    type\n    is_published\n    is_preview\n    is_deterministic\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment BotInstallationFragment on BotInstallation {\n    id\n    created_at\n    bot {\n      name\n      org {\n        provider_type\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment BotInstallationFragment on BotInstallation {\n    id\n    created_at\n    bot {\n      name\n      org {\n        provider_type\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment PublicBotFragment on PublicBot {\n    id\n    name\n    short_description\n    image_url\n    is_published\n    is_preview\n    is_deterministic\n    org {\n      name\n    }\n    installation(org_id: $org_id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment PublicBotFragment on PublicBot {\n    id\n    name\n    short_description\n    image_url\n    is_published\n    is_preview\n    is_deterministic\n    org {\n      name\n    }\n    installation(org_id: $org_id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BotCreate($org_id: Int!, $input: BotCreateInput!) {\n    botCreate(org_id: $org_id, input: $input) {\n      ...BotFragment\n    }\n  }\n"): (typeof documents)["\n  mutation BotCreate($org_id: Int!, $input: BotCreateInput!) {\n    botCreate(org_id: $org_id, input: $input) {\n      ...BotFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query BotInstallations($org_id: Int!) {\n    botInstallations(org_id: $org_id) {\n      id\n      ...BotInstallationFragment\n    }\n  }\n"): (typeof documents)["\n  query BotInstallations($org_id: Int!) {\n    botInstallations(org_id: $org_id) {\n      id\n      ...BotInstallationFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Bots($org_id: Int!) {\n    bots(org_id: $org_id) {\n      id\n      ...BotFragment\n    }\n  }\n"): (typeof documents)["\n  query Bots($org_id: Int!) {\n    bots(org_id: $org_id) {\n      id\n      ...BotFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PublicBot(\n    $org_name: String!\n    $name: String!\n    $org_id: Int!\n  ) {\n    publicBot(org_name: $org_name, name: $name) {\n      id\n      name\n      short_description\n      image_url\n      description\n      homepage\n      is_published\n      is_preview\n      is_deterministic\n      org {\n        name\n      }\n      installation(org_id: $org_id) {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query PublicBot(\n    $org_name: String!\n    $name: String!\n    $org_id: Int!\n  ) {\n    publicBot(org_name: $org_name, name: $name) {\n      id\n      name\n      short_description\n      image_url\n      description\n      homepage\n      is_published\n      is_preview\n      is_deterministic\n      org {\n        name\n      }\n      installation(org_id: $org_id) {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BotInstall($org_id: Int!, $input: BotInstallInput!) {\n    botInstall(org_id: $org_id, input: $input) {\n      ...BotInstallationFragment\n    }\n  }\n"): (typeof documents)["\n  mutation BotInstall($org_id: Int!, $input: BotInstallInput!) {\n    botInstall(org_id: $org_id, input: $input) {\n      ...BotInstallationFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BotUninstall($org_id: Int!, $bot_id: Int!) {\n    botUninstall(org_id: $org_id, bot_id: $bot_id)\n  }\n"): (typeof documents)["\n  mutation BotUninstall($org_id: Int!, $bot_id: Int!) {\n    botUninstall(org_id: $org_id, bot_id: $bot_id)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PublicBots($org_id: Int!, $filter: PublicBotsFilter) {\n    publicBots(filter: $filter) {\n      id\n      ...PublicBotFragment\n    }\n  }\n"): (typeof documents)["\n  query PublicBots($org_id: Int!, $filter: PublicBotsFilter) {\n    publicBots(filter: $filter) {\n      id\n      ...PublicBotFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment OrgsQueryFragment on Query {\n    orgs {\n      id\n      name\n      provider_type\n      provider_id\n      provider_name\n      has_installation\n\n      botInstallationsCount\n    }\n  }\n"): (typeof documents)["\n  fragment OrgsQueryFragment on Query {\n    orgs {\n      id\n      name\n      provider_type\n      provider_id\n      provider_name\n      has_installation\n\n      botInstallationsCount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Integrations($org_id: Int!) {\n    integrations(org_id: $org_id) {\n      id\n      integration_type\n      config\n      created_at\n      author {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query Integrations($org_id: Int!) {\n    integrations(org_id: $org_id) {\n      id\n      integration_type\n      config\n      created_at\n      author {\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment RepoFragment on Repo {\n    id\n    name\n    is_private\n    is_archived\n    has_installation\n  }\n"): (typeof documents)["\n  fragment RepoFragment on Repo {\n    id\n    name\n    is_private\n    is_archived\n    has_installation\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Repo(\n    $org_name: String!\n    $name: String!\n  ) {\n    repo(org_name: $org_name, name: $name) {\n      id\n      name\n      provider_id\n      is_private\n      is_archived\n      has_installation\n      org {\n        id\n        name\n        provider_type\n        github_installation_id\n      }\n    }\n  }\n"): (typeof documents)["\n  query Repo(\n    $org_name: String!\n    $name: String!\n  ) {\n    repo(org_name: $org_name, name: $name) {\n      id\n      name\n      provider_id\n      is_private\n      is_archived\n      has_installation\n      org {\n        id\n        name\n        provider_type\n        github_installation_id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Repos($org_id: Int!) {\n    repos(org_id: $org_id) {\n      id\n      ...RepoFragment\n    }\n  }\n"): (typeof documents)["\n  query Repos($org_id: Int!) {\n    repos(org_id: $org_id) {\n      id\n      ...RepoFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment TaskFragment on Task {\n    id\n    title\n    created_at\n    completed_at\n    is_completed\n    author {\n      ...UserAvatarFragment\n    }\n    items {\n      id\n      type\n      created_at\n      content\n      origin\n      pull_request\n    }\n  }\n"): (typeof documents)["\n  fragment TaskFragment on Task {\n    id\n    title\n    created_at\n    completed_at\n    is_completed\n    author {\n      ...UserAvatarFragment\n    }\n    items {\n      id\n      type\n      created_at\n      content\n      origin\n      pull_request\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation TaskCreate($org_id: Int!, $input: TaskMessageInput!) {\n    taskCreate(org_id: $org_id, input: $input) {\n      ...TaskFragment\n    }\n  }\n"): (typeof documents)["\n  mutation TaskCreate($org_id: Int!, $input: TaskMessageInput!) {\n    taskCreate(org_id: $org_id, input: $input) {\n      ...TaskFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Tasks($org_id: Int!) {\n    tasks(org_id: $org_id) {\n      id\n      ...TaskFragment\n    }\n  }\n"): (typeof documents)["\n  query Tasks($org_id: Int!) {\n    tasks(org_id: $org_id) {\n      id\n      ...TaskFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment UserAvatarFragment on User {\n    id\n    name\n    providers {\n      id\n      provider_type\n      provider_id\n    }\n  }\n"): (typeof documents)["\n  fragment UserAvatarFragment on User {\n    id\n    name\n    providers {\n      id\n      provider_type\n      provider_id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment MeQueryFragment on Query {\n    me {\n      email\n      ...UserAvatarFragment\n    }\n  }\n"): (typeof documents)["\n  fragment MeQueryFragment on Query {\n    me {\n      email\n      ...UserAvatarFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Me {\n    ...MeQueryFragment\n  }\n"): (typeof documents)["\n  query Me {\n    ...MeQueryFragment\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UserUpdate($input: UserUpdateInput!) {\n    userUpdate(input: $input) {\n      id\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation UserUpdate($input: UserUpdateInput!) {\n    userUpdate(input: $input) {\n      id\n      name\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Dashboard {\n    ...MeQueryFragment\n    ...OrgsQueryFragment\n  }\n"): (typeof documents)["\n  query Dashboard {\n    ...MeQueryFragment\n    ...OrgsQueryFragment\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;