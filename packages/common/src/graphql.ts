import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { provider, users, user_providers, orgs, competitor, repos, bot, bots, bot_installations, project_provider, org_project_providers, tasks } from '@prisma/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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

export enum CompetitorType {
  Dependabot = 'dependabot',
  Renovate = 'renovate'
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



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Bot: ResolverTypeWrapper<bots>;
  BotCreateInput: BotCreateInput;
  BotInstallation: ResolverTypeWrapper<bot_installations>;
  BotType: ResolverTypeWrapper<bot>;
  CompetitorType: ResolverTypeWrapper<competitor>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Org: ResolverTypeWrapper<orgs>;
  ProjectIntegrationConnection: ResolverTypeWrapper<org_project_providers>;
  ProjectProviderType: ResolverTypeWrapper<project_provider>;
  ProviderType: ResolverTypeWrapper<provider>;
  Query: ResolverTypeWrapper<{}>;
  Repo: ResolverTypeWrapper<repos>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Task: ResolverTypeWrapper<tasks>;
  TaskMessageInput: TaskMessageInput;
  User: ResolverTypeWrapper<users>;
  UserProvider: ResolverTypeWrapper<user_providers>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Bot: bots;
  BotCreateInput: BotCreateInput;
  BotInstallation: bot_installations;
  DateTime: Scalars['DateTime']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  Mutation: {};
  Org: orgs;
  ProjectIntegrationConnection: org_project_providers;
  Query: {};
  Repo: repos;
  String: Scalars['String']['output'];
  Task: tasks;
  TaskMessageInput: TaskMessageInput;
  User: users;
  UserProvider: user_providers;
};

export type BotResolvers<ContextType = any, ParentType extends ResolversParentTypes['Bot'] = ResolversParentTypes['Bot']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  homepage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  is_published?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  org?: Resolver<ResolversTypes['Org'], ParentType, ContextType>;
  published_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['BotType'], ParentType, ContextType>;
  webhook_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotInstallationResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotInstallation'] = ResolversParentTypes['BotInstallation']> = {
  bot?: Resolver<ResolversTypes['Bot'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  org?: Resolver<ResolversTypes['Org'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotTypeResolvers = EnumResolverSignature<{ webhook?: any }, ResolversTypes['BotType']>;

export type CompetitorTypeResolvers = EnumResolverSignature<{ dependabot?: any, renovate?: any }, ResolversTypes['CompetitorType']>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  botCreate?: Resolver<ResolversTypes['Bot'], ParentType, ContextType, RequireFields<MutationBotCreateArgs, 'input' | 'org_id'>>;
  taskCreate?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationTaskCreateArgs, 'input' | 'org_id'>>;
};

export type OrgResolvers<ContextType = any, ParentType extends ResolversParentTypes['Org'] = ResolversParentTypes['Org']> = {
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

export type ProjectIntegrationConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectIntegrationConnection'] = ResolversParentTypes['ProjectIntegrationConnection']> = {
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  config?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider_type?: Resolver<ResolversTypes['ProjectProviderType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectProviderTypeResolvers = EnumResolverSignature<{ github?: any, linear?: any }, ResolversTypes['ProjectProviderType']>;

export type ProviderTypeResolvers = EnumResolverSignature<{ github?: any, gitlab?: any }, ResolversTypes['ProviderType']>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  botInstallations?: Resolver<Array<ResolversTypes['BotInstallation']>, ParentType, ContextType, RequireFields<QueryBotInstallationsArgs, 'org_id'>>;
  bots?: Resolver<Array<ResolversTypes['Bot']>, ParentType, ContextType, RequireFields<QueryBotsArgs, 'org_id'>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  orgs?: Resolver<Array<ResolversTypes['Org']>, ParentType, ContextType>;
  project_integration_connections?: Resolver<Array<ResolversTypes['ProjectIntegrationConnection']>, ParentType, ContextType, RequireFields<QueryProject_Integration_ConnectionsArgs, 'org_id'>>;
  repo?: Resolver<Maybe<ResolversTypes['Repo']>, ParentType, ContextType, RequireFields<QueryRepoArgs, 'name' | 'org_name'>>;
  repos?: Resolver<Array<ResolversTypes['Repo']>, ParentType, ContextType, RequireFields<QueryReposArgs, 'org_id'>>;
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QueryTasksArgs, 'org_id'>>;
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = {
  author?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  org?: Resolver<ResolversTypes['Org'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  Bot?: BotResolvers<ContextType>;
  BotInstallation?: BotInstallationResolvers<ContextType>;
  BotType?: BotTypeResolvers;
  CompetitorType?: CompetitorTypeResolvers;
  DateTime?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Org?: OrgResolvers<ContextType>;
  ProjectIntegrationConnection?: ProjectIntegrationConnectionResolvers<ContextType>;
  ProjectProviderType?: ProjectProviderTypeResolvers;
  ProviderType?: ProviderTypeResolvers;
  Query?: QueryResolvers<ContextType>;
  Repo?: RepoResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserProvider?: UserProviderResolvers<ContextType>;
};

