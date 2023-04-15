import { GraphQLResolveInfo } from 'graphql';
import { orgs, repos } from '.prisma/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Org = {
  __typename?: 'Org';
  github_installation_id?: Maybe<Scalars['Int']>;
  has_installation: Scalars['Boolean'];
  id: Scalars['Int'];
  is_user: Scalars['Boolean'];
  name: Scalars['String'];
  provider_id: Scalars['String'];
  provider_type: Scalars['String'];
  repos: Array<Repo>;
};

export enum ProviderType {
  Bitbucket = 'bitbucket',
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
  name: Scalars['String'];
  provider_type: ProviderType;
};


export type QueryRepoArgs = {
  name: Scalars['String'];
  org_name: Scalars['String'];
  provider_type: ProviderType;
};

export type Repo = {
  __typename?: 'Repo';
  has_installation: Scalars['Boolean'];
  id: Scalars['Int'];
  is_archived: Scalars['Boolean'];
  is_private: Scalars['Boolean'];
  name: Scalars['String'];
  org: Org;
  provider_id: Scalars['String'];
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Org: ResolverTypeWrapper<orgs>;
  ProviderType: ProviderType;
  Query: ResolverTypeWrapper<{}>;
  Repo: ResolverTypeWrapper<repos>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Int: Scalars['Int'];
  Org: orgs;
  Query: {};
  Repo: repos;
  String: Scalars['String'];
};

export type OrgResolvers<ContextType = any, ParentType extends ResolversParentTypes['Org'] = ResolversParentTypes['Org']> = {
  github_installation_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  has_installation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  is_user?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider_type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  repos?: Resolver<Array<ResolversTypes['Repo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  org?: Resolver<Maybe<ResolversTypes['Org']>, ParentType, ContextType, RequireFields<QueryOrgArgs, 'name' | 'provider_type'>>;
  orgs?: Resolver<Array<ResolversTypes['Org']>, ParentType, ContextType>;
  repo?: Resolver<Maybe<ResolversTypes['Repo']>, ParentType, ContextType, RequireFields<QueryRepoArgs, 'name' | 'org_name' | 'provider_type'>>;
};

export type RepoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Repo'] = ResolversParentTypes['Repo']> = {
  has_installation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  is_archived?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_private?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  org?: Resolver<ResolversTypes['Org'], ParentType, ContextType>;
  provider_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Org?: OrgResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Repo?: RepoResolvers<ContextType>;
};

