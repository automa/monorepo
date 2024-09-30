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
    "\n  fragment BotBase on BotBase {\n    id\n    name\n    short_description\n    type\n    image_url\n    is_published\n    is_preview\n    is_deterministic\n  }\n": types.BotBaseFragmentDoc,
    "\n  fragment BotInstallation on BotInstallation {\n    id\n    created_at\n    bot {\n      name\n      org {\n        provider_type\n        name\n      }\n    }\n  }\n": types.BotInstallationFragmentDoc,
    "\n  fragment PublicBot on PublicBot {\n    ...BotBase\n    org {\n      name\n    }\n    installation(org_id: $org_id) {\n      id\n    }\n  }\n": types.PublicBotFragmentDoc,
    "\n  fragment Bot on Bot {\n    id\n    name\n    short_description\n    type\n    webhook_url\n    webhook_secret\n    draft_paths\n    paths\n    image_url\n    description\n    homepage\n    is_published\n    is_preview\n    is_deterministic\n  }\n": types.BotFragmentDoc,
    "\n  query Bot(\n    $org_id: Int!\n    $name: String!\n  ) {\n    bot(org_id: $org_id, name: $name) {\n      ...Bot\n    }\n  }\n": types.BotDocument,
    "\n  mutation BotUpdate($org_id: Int!, $name: String!, $input: BotUpdateInput!) {\n    botUpdate(org_id: $org_id, name: $name, input: $input) {\n      ...Bot\n    }\n  }\n": types.BotUpdateDocument,
    "\n  mutation BotPublish($org_id: Int!, $name: String!) {\n    botPublish(org_id: $org_id, name: $name) {\n      ...Bot\n    }\n  }\n": types.BotPublishDocument,
    "\n  mutation BotCreate($org_id: Int!, $input: BotCreateInput!) {\n    botCreate(org_id: $org_id, input: $input) {\n      ...BotBase\n    }\n  }\n": types.BotCreateDocument,
    "\n  query BotInstallations($org_id: Int!) {\n    botInstallations(org_id: $org_id) {\n      id\n      ...BotInstallation\n    }\n  }\n": types.BotInstallationsDocument,
    "\n  query Bots($org_id: Int!) {\n    bots(org_id: $org_id) {\n      id\n      ...BotBase\n    }\n  }\n": types.BotsDocument,
    "\n  query PublicBot(\n    $org_name: String!\n    $name: String!\n    $org_id: Int!\n  ) {\n    publicBot(org_name: $org_name, name: $name) {\n      id\n      name\n      short_description\n      type\n      paths\n      image_url\n      description\n      homepage\n      is_published\n      is_preview\n      is_deterministic\n      org {\n        name\n      }\n      installation(org_id: $org_id) {\n        id\n      }\n    }\n  }\n": types.PublicBotDocument,
    "\n  mutation BotInstall($org_id: Int!, $input: BotInstallInput!) {\n    botInstall(org_id: $org_id, input: $input) {\n      ...BotInstallation\n    }\n  }\n": types.BotInstallDocument,
    "\n  mutation BotUninstall($org_id: Int!, $bot_id: Int!) {\n    botUninstall(org_id: $org_id, bot_id: $bot_id)\n  }\n": types.BotUninstallDocument,
    "\n  query PublicBots($org_id: Int!, $filter: PublicBotsFilter) {\n    publicBots(filter: $filter) {\n      id\n      ...PublicBot\n    }\n  }\n": types.PublicBotsDocument,
    "\n  fragment OrgsQuery on Query {\n    orgs {\n      id\n      name\n      provider_type\n      provider_id\n      provider_name\n      has_installation\n\n      bot_installations_count\n    }\n  }\n": types.OrgsQueryFragmentDoc,
    "\n  query Integrations($org_id: Int!) {\n    integrations(org_id: $org_id) {\n      id\n      type\n      config\n      created_at\n      author {\n        name\n      }\n    }\n  }\n": types.IntegrationsDocument,
    "\n  fragment Repo on Repo {\n    id\n    name\n    is_private\n    is_archived\n    has_installation\n  }\n": types.RepoFragmentDoc,
    "\n  query Repo(\n    $org_name: String!\n    $name: String!\n  ) {\n    repo(org_name: $org_name, name: $name) {\n      id\n      name\n      provider_id\n      is_private\n      is_archived\n      has_installation\n      org {\n        id\n        name\n        provider_type\n        github_installation_id\n      }\n    }\n  }\n": types.RepoDocument,
    "\n  query Repos($org_id: Int!) {\n    repos(org_id: $org_id) {\n      id\n      ...Repo\n    }\n  }\n": types.ReposDocument,
    "\n  fragment Task on Task {\n    id\n    title\n    is_scheduled\n    state\n    created_at\n    items {\n      ...TaskItem\n    }\n  }\n": types.TaskFragmentDoc,
    "\n  fragment TaskItem on TaskItem {\n    id\n    type\n    data\n    created_at\n    actor_user {\n      ...UserAvatar\n    }\n    bot {\n      id\n      name\n      image_url\n      org {\n        id\n        name\n      }\n    }\n    repo {\n      id\n      name\n      org {\n        id\n        provider_type\n        provider_name\n      }\n    }\n    activity {\n      id\n      type\n      from_state\n      to_state\n    }\n  }\n": types.TaskItemFragmentDoc,
    "\n  query Task($org_id: Int!, $id: Int!) {\n    task(org_id: $org_id, id: $id) {\n      id\n      ...Task\n    }\n  }\n": types.TaskDocument,
    "\n  mutation TaskCreate($org_id: Int!, $input: TaskMessageInput!) {\n    taskCreate(org_id: $org_id, input: $input) {\n      ...Task\n    }\n  }\n": types.TaskCreateDocument,
    "\n  query Tasks($org_id: Int!, $filter: TasksFilter) {\n    tasks(org_id: $org_id, filter: $filter) {\n      id\n      ...Task\n    }\n  }\n": types.TasksDocument,
    "\n  fragment UserAvatar on User {\n    id\n    name\n    providers {\n      id\n      provider_type\n      provider_id\n    }\n  }\n": types.UserAvatarFragmentDoc,
    "\n  fragment MeQuery on Query {\n    me {\n      email\n      ...UserAvatar\n    }\n  }\n": types.MeQueryFragmentDoc,
    "\n  query Me {\n    ...MeQuery\n  }\n": types.MeDocument,
    "\n  mutation UserUpdate($input: UserUpdateInput!) {\n    userUpdate(input: $input) {\n      id\n      name\n      email\n    }\n  }\n": types.UserUpdateDocument,
    "\n  query Dashboard {\n    ...MeQuery\n    ...OrgsQuery\n  }\n": types.DashboardDocument,
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
export function gql(source: "\n  fragment BotBase on BotBase {\n    id\n    name\n    short_description\n    type\n    image_url\n    is_published\n    is_preview\n    is_deterministic\n  }\n"): (typeof documents)["\n  fragment BotBase on BotBase {\n    id\n    name\n    short_description\n    type\n    image_url\n    is_published\n    is_preview\n    is_deterministic\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment BotInstallation on BotInstallation {\n    id\n    created_at\n    bot {\n      name\n      org {\n        provider_type\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment BotInstallation on BotInstallation {\n    id\n    created_at\n    bot {\n      name\n      org {\n        provider_type\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment PublicBot on PublicBot {\n    ...BotBase\n    org {\n      name\n    }\n    installation(org_id: $org_id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment PublicBot on PublicBot {\n    ...BotBase\n    org {\n      name\n    }\n    installation(org_id: $org_id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Bot on Bot {\n    id\n    name\n    short_description\n    type\n    webhook_url\n    webhook_secret\n    draft_paths\n    paths\n    image_url\n    description\n    homepage\n    is_published\n    is_preview\n    is_deterministic\n  }\n"): (typeof documents)["\n  fragment Bot on Bot {\n    id\n    name\n    short_description\n    type\n    webhook_url\n    webhook_secret\n    draft_paths\n    paths\n    image_url\n    description\n    homepage\n    is_published\n    is_preview\n    is_deterministic\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Bot(\n    $org_id: Int!\n    $name: String!\n  ) {\n    bot(org_id: $org_id, name: $name) {\n      ...Bot\n    }\n  }\n"): (typeof documents)["\n  query Bot(\n    $org_id: Int!\n    $name: String!\n  ) {\n    bot(org_id: $org_id, name: $name) {\n      ...Bot\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BotUpdate($org_id: Int!, $name: String!, $input: BotUpdateInput!) {\n    botUpdate(org_id: $org_id, name: $name, input: $input) {\n      ...Bot\n    }\n  }\n"): (typeof documents)["\n  mutation BotUpdate($org_id: Int!, $name: String!, $input: BotUpdateInput!) {\n    botUpdate(org_id: $org_id, name: $name, input: $input) {\n      ...Bot\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BotPublish($org_id: Int!, $name: String!) {\n    botPublish(org_id: $org_id, name: $name) {\n      ...Bot\n    }\n  }\n"): (typeof documents)["\n  mutation BotPublish($org_id: Int!, $name: String!) {\n    botPublish(org_id: $org_id, name: $name) {\n      ...Bot\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BotCreate($org_id: Int!, $input: BotCreateInput!) {\n    botCreate(org_id: $org_id, input: $input) {\n      ...BotBase\n    }\n  }\n"): (typeof documents)["\n  mutation BotCreate($org_id: Int!, $input: BotCreateInput!) {\n    botCreate(org_id: $org_id, input: $input) {\n      ...BotBase\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query BotInstallations($org_id: Int!) {\n    botInstallations(org_id: $org_id) {\n      id\n      ...BotInstallation\n    }\n  }\n"): (typeof documents)["\n  query BotInstallations($org_id: Int!) {\n    botInstallations(org_id: $org_id) {\n      id\n      ...BotInstallation\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Bots($org_id: Int!) {\n    bots(org_id: $org_id) {\n      id\n      ...BotBase\n    }\n  }\n"): (typeof documents)["\n  query Bots($org_id: Int!) {\n    bots(org_id: $org_id) {\n      id\n      ...BotBase\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PublicBot(\n    $org_name: String!\n    $name: String!\n    $org_id: Int!\n  ) {\n    publicBot(org_name: $org_name, name: $name) {\n      id\n      name\n      short_description\n      type\n      paths\n      image_url\n      description\n      homepage\n      is_published\n      is_preview\n      is_deterministic\n      org {\n        name\n      }\n      installation(org_id: $org_id) {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query PublicBot(\n    $org_name: String!\n    $name: String!\n    $org_id: Int!\n  ) {\n    publicBot(org_name: $org_name, name: $name) {\n      id\n      name\n      short_description\n      type\n      paths\n      image_url\n      description\n      homepage\n      is_published\n      is_preview\n      is_deterministic\n      org {\n        name\n      }\n      installation(org_id: $org_id) {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BotInstall($org_id: Int!, $input: BotInstallInput!) {\n    botInstall(org_id: $org_id, input: $input) {\n      ...BotInstallation\n    }\n  }\n"): (typeof documents)["\n  mutation BotInstall($org_id: Int!, $input: BotInstallInput!) {\n    botInstall(org_id: $org_id, input: $input) {\n      ...BotInstallation\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BotUninstall($org_id: Int!, $bot_id: Int!) {\n    botUninstall(org_id: $org_id, bot_id: $bot_id)\n  }\n"): (typeof documents)["\n  mutation BotUninstall($org_id: Int!, $bot_id: Int!) {\n    botUninstall(org_id: $org_id, bot_id: $bot_id)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PublicBots($org_id: Int!, $filter: PublicBotsFilter) {\n    publicBots(filter: $filter) {\n      id\n      ...PublicBot\n    }\n  }\n"): (typeof documents)["\n  query PublicBots($org_id: Int!, $filter: PublicBotsFilter) {\n    publicBots(filter: $filter) {\n      id\n      ...PublicBot\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment OrgsQuery on Query {\n    orgs {\n      id\n      name\n      provider_type\n      provider_id\n      provider_name\n      has_installation\n\n      bot_installations_count\n    }\n  }\n"): (typeof documents)["\n  fragment OrgsQuery on Query {\n    orgs {\n      id\n      name\n      provider_type\n      provider_id\n      provider_name\n      has_installation\n\n      bot_installations_count\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Integrations($org_id: Int!) {\n    integrations(org_id: $org_id) {\n      id\n      type\n      config\n      created_at\n      author {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query Integrations($org_id: Int!) {\n    integrations(org_id: $org_id) {\n      id\n      type\n      config\n      created_at\n      author {\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Repo on Repo {\n    id\n    name\n    is_private\n    is_archived\n    has_installation\n  }\n"): (typeof documents)["\n  fragment Repo on Repo {\n    id\n    name\n    is_private\n    is_archived\n    has_installation\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Repo(\n    $org_name: String!\n    $name: String!\n  ) {\n    repo(org_name: $org_name, name: $name) {\n      id\n      name\n      provider_id\n      is_private\n      is_archived\n      has_installation\n      org {\n        id\n        name\n        provider_type\n        github_installation_id\n      }\n    }\n  }\n"): (typeof documents)["\n  query Repo(\n    $org_name: String!\n    $name: String!\n  ) {\n    repo(org_name: $org_name, name: $name) {\n      id\n      name\n      provider_id\n      is_private\n      is_archived\n      has_installation\n      org {\n        id\n        name\n        provider_type\n        github_installation_id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Repos($org_id: Int!) {\n    repos(org_id: $org_id) {\n      id\n      ...Repo\n    }\n  }\n"): (typeof documents)["\n  query Repos($org_id: Int!) {\n    repos(org_id: $org_id) {\n      id\n      ...Repo\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Task on Task {\n    id\n    title\n    is_scheduled\n    state\n    created_at\n    items {\n      ...TaskItem\n    }\n  }\n"): (typeof documents)["\n  fragment Task on Task {\n    id\n    title\n    is_scheduled\n    state\n    created_at\n    items {\n      ...TaskItem\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment TaskItem on TaskItem {\n    id\n    type\n    data\n    created_at\n    actor_user {\n      ...UserAvatar\n    }\n    bot {\n      id\n      name\n      image_url\n      org {\n        id\n        name\n      }\n    }\n    repo {\n      id\n      name\n      org {\n        id\n        provider_type\n        provider_name\n      }\n    }\n    activity {\n      id\n      type\n      from_state\n      to_state\n    }\n  }\n"): (typeof documents)["\n  fragment TaskItem on TaskItem {\n    id\n    type\n    data\n    created_at\n    actor_user {\n      ...UserAvatar\n    }\n    bot {\n      id\n      name\n      image_url\n      org {\n        id\n        name\n      }\n    }\n    repo {\n      id\n      name\n      org {\n        id\n        provider_type\n        provider_name\n      }\n    }\n    activity {\n      id\n      type\n      from_state\n      to_state\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Task($org_id: Int!, $id: Int!) {\n    task(org_id: $org_id, id: $id) {\n      id\n      ...Task\n    }\n  }\n"): (typeof documents)["\n  query Task($org_id: Int!, $id: Int!) {\n    task(org_id: $org_id, id: $id) {\n      id\n      ...Task\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation TaskCreate($org_id: Int!, $input: TaskMessageInput!) {\n    taskCreate(org_id: $org_id, input: $input) {\n      ...Task\n    }\n  }\n"): (typeof documents)["\n  mutation TaskCreate($org_id: Int!, $input: TaskMessageInput!) {\n    taskCreate(org_id: $org_id, input: $input) {\n      ...Task\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Tasks($org_id: Int!, $filter: TasksFilter) {\n    tasks(org_id: $org_id, filter: $filter) {\n      id\n      ...Task\n    }\n  }\n"): (typeof documents)["\n  query Tasks($org_id: Int!, $filter: TasksFilter) {\n    tasks(org_id: $org_id, filter: $filter) {\n      id\n      ...Task\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment UserAvatar on User {\n    id\n    name\n    providers {\n      id\n      provider_type\n      provider_id\n    }\n  }\n"): (typeof documents)["\n  fragment UserAvatar on User {\n    id\n    name\n    providers {\n      id\n      provider_type\n      provider_id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment MeQuery on Query {\n    me {\n      email\n      ...UserAvatar\n    }\n  }\n"): (typeof documents)["\n  fragment MeQuery on Query {\n    me {\n      email\n      ...UserAvatar\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Me {\n    ...MeQuery\n  }\n"): (typeof documents)["\n  query Me {\n    ...MeQuery\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UserUpdate($input: UserUpdateInput!) {\n    userUpdate(input: $input) {\n      id\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation UserUpdate($input: UserUpdateInput!) {\n    userUpdate(input: $input) {\n      id\n      name\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Dashboard {\n    ...MeQuery\n    ...OrgsQuery\n  }\n"): (typeof documents)["\n  query Dashboard {\n    ...MeQuery\n    ...OrgsQuery\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;