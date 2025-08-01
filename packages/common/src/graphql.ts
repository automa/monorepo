import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { provider, users, user_providers, orgs, repos, bot, bots, bot_installations, integration, integrations, task_state, tasks, task_activity, task_activities, task_item, task_items } from '@prisma/client';
import { public_orgs, public_bots } from './public';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type App = {
  __typename?: 'App';
  client_uri: Scalars['String']['output'];
  cloud: Scalars['Boolean']['output'];
  integrations: AppIntegrations;
  webhook_uri: Scalars['String']['output'];
};

export type AppIntegrations = {
  __typename?: 'AppIntegrations';
  github: Scalars['Boolean']['output'];
  gitlab: Scalars['Boolean']['output'];
  jira: Scalars['Boolean']['output'];
  linear: Scalars['Boolean']['output'];
  slack: Scalars['Boolean']['output'];
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
  app: App;
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
  user?: Maybe<User>;
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  BotBase: ( bots ) | ( public_bots );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  App: ResolverTypeWrapper<App>;
  AppIntegrations: ResolverTypeWrapper<AppIntegrations>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Bot: ResolverTypeWrapper<bots>;
  BotBase: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['BotBase']>;
  BotCreateInput: BotCreateInput;
  BotInstallInput: BotInstallInput;
  BotInstallation: ResolverTypeWrapper<bot_installations>;
  BotInstallationsFilter: BotInstallationsFilter;
  BotType: ResolverTypeWrapper<bot>;
  BotUpdateInput: BotUpdateInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Integration: ResolverTypeWrapper<integrations>;
  IntegrationType: ResolverTypeWrapper<integration>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Org: ResolverTypeWrapper<orgs>;
  ProviderType: ResolverTypeWrapper<provider>;
  PublicBot: ResolverTypeWrapper<public_bots>;
  PublicBotInstallation: ResolverTypeWrapper<bot_installations>;
  PublicBotsFilter: PublicBotsFilter;
  PublicOrg: ResolverTypeWrapper<public_orgs>;
  Query: ResolverTypeWrapper<{}>;
  Repo: ResolverTypeWrapper<repos>;
  ReposFilter: ReposFilter;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Task: ResolverTypeWrapper<tasks>;
  TaskActivity: ResolverTypeWrapper<task_activities>;
  TaskActivityType: ResolverTypeWrapper<task_activity>;
  TaskCreateInput: TaskCreateInput;
  TaskItem: ResolverTypeWrapper<task_items>;
  TaskItemType: ResolverTypeWrapper<task_item>;
  TaskState: ResolverTypeWrapper<task_state>;
  TasksCount: ResolverTypeWrapper<Omit<TasksCount, 'state'> & { state: ResolversTypes['TaskState'] }>;
  TasksFilter: TasksFilter;
  User: ResolverTypeWrapper<users>;
  UserProvider: ResolverTypeWrapper<user_providers>;
  UserUpdateInput: UserUpdateInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  App: App;
  AppIntegrations: AppIntegrations;
  Boolean: Scalars['Boolean']['output'];
  Bot: bots;
  BotBase: ResolversInterfaceTypes<ResolversParentTypes>['BotBase'];
  BotCreateInput: BotCreateInput;
  BotInstallInput: BotInstallInput;
  BotInstallation: bot_installations;
  BotInstallationsFilter: BotInstallationsFilter;
  BotUpdateInput: BotUpdateInput;
  DateTime: Scalars['DateTime']['output'];
  Int: Scalars['Int']['output'];
  Integration: integrations;
  JSON: Scalars['JSON']['output'];
  Mutation: {};
  Org: orgs;
  PublicBot: public_bots;
  PublicBotInstallation: bot_installations;
  PublicBotsFilter: PublicBotsFilter;
  PublicOrg: public_orgs;
  Query: {};
  Repo: repos;
  ReposFilter: ReposFilter;
  String: Scalars['String']['output'];
  Task: tasks;
  TaskActivity: task_activities;
  TaskCreateInput: TaskCreateInput;
  TaskItem: task_items;
  TasksCount: TasksCount;
  TasksFilter: TasksFilter;
  User: users;
  UserProvider: user_providers;
  UserUpdateInput: UserUpdateInput;
};

export type InheritsDirectiveArgs = {
  type: Scalars['String']['input'];
};

export type InheritsDirectiveResolver<Result, Parent, ContextType = any, Args = InheritsDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AppResolvers<ContextType = any, ParentType extends ResolversParentTypes['App'] = ResolversParentTypes['App']> = {
  client_uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cloud?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  integrations?: Resolver<ResolversTypes['AppIntegrations'], ParentType, ContextType>;
  webhook_uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppIntegrationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppIntegrations'] = ResolversParentTypes['AppIntegrations']> = {
  github?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  gitlab?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  jira?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  linear?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  slack?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotResolvers<ContextType = any, ParentType extends ResolversParentTypes['Bot'] = ResolversParentTypes['Bot']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  draft_paths?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  homepage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  image_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_deterministic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_preview?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_published?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  org?: Resolver<ResolversTypes['Org'], ParentType, ContextType>;
  paths?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  published_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  short_description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['BotType'], ParentType, ContextType>;
  webhook_secret?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  webhook_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotBaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotBase'] = ResolversParentTypes['BotBase']> = {
  __resolveType: TypeResolveFn<'Bot' | 'PublicBot', ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  homepage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  image_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_deterministic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_preview?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_published?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paths?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  short_description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['BotType'], ParentType, ContextType>;
};

export type BotInstallationResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotInstallation'] = ResolversParentTypes['BotInstallation']> = {
  bot?: Resolver<ResolversTypes['PublicBot'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  org?: Resolver<ResolversTypes['Org'], ParentType, ContextType>;
  tasks_count?: Resolver<Array<ResolversTypes['TasksCount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotTypeResolvers = EnumResolverSignature<{ manual?: any, scheduled?: any }, ResolversTypes['BotType']>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type IntegrationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Integration'] = ResolversParentTypes['Integration']> = {
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  config?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['IntegrationType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IntegrationTypeResolvers = EnumResolverSignature<{ github?: any, jira?: any, linear?: any, slack?: any }, ResolversTypes['IntegrationType']>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  botCreate?: Resolver<ResolversTypes['Bot'], ParentType, ContextType, RequireFields<MutationBotCreateArgs, 'input' | 'org_id'>>;
  botInstall?: Resolver<ResolversTypes['BotInstallation'], ParentType, ContextType, RequireFields<MutationBotInstallArgs, 'input' | 'org_id'>>;
  botPublish?: Resolver<ResolversTypes['Bot'], ParentType, ContextType, RequireFields<MutationBotPublishArgs, 'name' | 'org_id'>>;
  botUninstall?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationBotUninstallArgs, 'bot_id' | 'org_id'>>;
  botUpdate?: Resolver<ResolversTypes['Bot'], ParentType, ContextType, RequireFields<MutationBotUpdateArgs, 'input' | 'name' | 'org_id'>>;
  taskCreate?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationTaskCreateArgs, 'input' | 'org_id'>>;
  userUpdate?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUserUpdateArgs, 'input'>>;
};

export type OrgResolvers<ContextType = any, ParentType extends ResolversParentTypes['Org'] = ResolversParentTypes['Org']> = {
  bot_installations_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  github_installation_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  has_installation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  is_user?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider_type?: Resolver<ResolversTypes['ProviderType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProviderTypeResolvers = EnumResolverSignature<{ github?: any, gitlab?: any }, ResolversTypes['ProviderType']>;

export type PublicBotResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicBot'] = ResolversParentTypes['PublicBot']> = {
  description?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  homepage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  image_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  installation?: Resolver<Maybe<ResolversTypes['PublicBotInstallation']>, ParentType, ContextType, RequireFields<PublicBotInstallationArgs, 'org_id'>>;
  is_deterministic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_preview?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_published?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  org?: Resolver<ResolversTypes['PublicOrg'], ParentType, ContextType>;
  paths?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  short_description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['BotType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublicBotInstallationResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicBotInstallation'] = ResolversParentTypes['PublicBotInstallation']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  org?: Resolver<ResolversTypes['PublicOrg'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublicOrgResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicOrg'] = ResolversParentTypes['PublicOrg']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider_type?: Resolver<ResolversTypes['ProviderType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  app?: Resolver<ResolversTypes['App'], ParentType, ContextType>;
  bot?: Resolver<ResolversTypes['Bot'], ParentType, ContextType, RequireFields<QueryBotArgs, 'name' | 'org_id'>>;
  botInstallations?: Resolver<Array<ResolversTypes['BotInstallation']>, ParentType, ContextType, RequireFields<QueryBotInstallationsArgs, 'org_id'>>;
  bots?: Resolver<Array<ResolversTypes['Bot']>, ParentType, ContextType, RequireFields<QueryBotsArgs, 'org_id'>>;
  integrations?: Resolver<Array<ResolversTypes['Integration']>, ParentType, ContextType, RequireFields<QueryIntegrationsArgs, 'org_id'>>;
  orgs?: Resolver<Array<ResolversTypes['Org']>, ParentType, ContextType>;
  publicBot?: Resolver<ResolversTypes['PublicBot'], ParentType, ContextType, RequireFields<QueryPublicBotArgs, 'name' | 'org_name'>>;
  publicBots?: Resolver<Array<ResolversTypes['PublicBot']>, ParentType, ContextType, Partial<QueryPublicBotsArgs>>;
  repo?: Resolver<Maybe<ResolversTypes['Repo']>, ParentType, ContextType, RequireFields<QueryRepoArgs, 'name' | 'org_id'>>;
  repos?: Resolver<Array<ResolversTypes['Repo']>, ParentType, ContextType, RequireFields<QueryReposArgs, 'org_id'>>;
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<QueryTaskArgs, 'id' | 'org_id'>>;
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QueryTasksArgs, 'org_id'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type RepoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Repo'] = ResolversParentTypes['Repo']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  has_installation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  is_archived?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_private?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  org?: Resolver<ResolversTypes['Org'], ParentType, ContextType>;
  provider_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tasks_count?: Resolver<Array<ResolversTypes['TasksCount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  is_scheduled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['TaskItem']>, ParentType, ContextType>;
  org?: Resolver<ResolversTypes['Org'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['TaskState'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskActivity'] = ResolversParentTypes['TaskActivity']> = {
  from_state?: Resolver<Maybe<ResolversTypes['TaskState']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  to_state?: Resolver<Maybe<ResolversTypes['TaskState']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TaskActivityType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskActivityTypeResolvers = EnumResolverSignature<{ state?: any }, ResolversTypes['TaskActivityType']>;

export type TaskItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskItem'] = ResolversParentTypes['TaskItem']> = {
  activity?: Resolver<Maybe<ResolversTypes['TaskActivity']>, ParentType, ContextType>;
  actor_user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  bot?: Resolver<Maybe<ResolversTypes['PublicBot']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  repo?: Resolver<Maybe<ResolversTypes['Repo']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TaskItemType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskItemTypeResolvers = EnumResolverSignature<{ activity?: any, bot?: any, message?: any, origin?: any, proposal?: any, repo?: any }, ResolversTypes['TaskItemType']>;

export type TaskStateResolvers = EnumResolverSignature<{ cancelled?: any, completed?: any, failed?: any, skipped?: any, started?: any, submitted?: any }, ResolversTypes['TaskState']>;

export type TasksCountResolvers<ContextType = any, ParentType extends ResolversParentTypes['TasksCount'] = ResolversParentTypes['TasksCount']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['TaskState'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  providers?: Resolver<Array<ResolversTypes['UserProvider']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserProviderResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserProvider'] = ResolversParentTypes['UserProvider']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  provider_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider_type?: Resolver<ResolversTypes['ProviderType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  App?: AppResolvers<ContextType>;
  AppIntegrations?: AppIntegrationsResolvers<ContextType>;
  Bot?: BotResolvers<ContextType>;
  BotBase?: BotBaseResolvers<ContextType>;
  BotInstallation?: BotInstallationResolvers<ContextType>;
  BotType?: BotTypeResolvers;
  DateTime?: GraphQLScalarType;
  Integration?: IntegrationResolvers<ContextType>;
  IntegrationType?: IntegrationTypeResolvers;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Org?: OrgResolvers<ContextType>;
  ProviderType?: ProviderTypeResolvers;
  PublicBot?: PublicBotResolvers<ContextType>;
  PublicBotInstallation?: PublicBotInstallationResolvers<ContextType>;
  PublicOrg?: PublicOrgResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Repo?: RepoResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  TaskActivity?: TaskActivityResolvers<ContextType>;
  TaskActivityType?: TaskActivityTypeResolvers;
  TaskItem?: TaskItemResolvers<ContextType>;
  TaskItemType?: TaskItemTypeResolvers;
  TaskState?: TaskStateResolvers;
  TasksCount?: TasksCountResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserProvider?: UserProviderResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  inherits?: InheritsDirectiveResolver<any, any, ContextType>;
};
