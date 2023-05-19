/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Event = {
  __typename?: 'Event';
  author?: Maybe<User>;
  author_id: Scalars['ID'];
  id: Scalars['ID'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  matches?: Maybe<Array<Maybe<Match>>>;
  photo: Scalars['String'];
  slots: Scalars['Int'];
  text: Scalars['String'];
  time: Scalars['DateTime'];
  title: Scalars['String'];
};

export type EventD = {
  __typename?: 'EventD';
  author?: Maybe<User>;
  author_id: Scalars['ID'];
  distance: Scalars['Int'];
  id: Scalars['ID'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  matches?: Maybe<Array<Maybe<Match>>>;
  photo: Scalars['String'];
  slots: Scalars['Int'];
  text: Scalars['String'];
  time: Scalars['DateTime'];
  title: Scalars['String'];
};

export type Match = {
  __typename?: 'Match';
  accepted?: Maybe<Scalars['Boolean']>;
  dissmised?: Maybe<Scalars['Boolean']>;
  event?: Maybe<Event>;
  event_id: Scalars['ID'];
  id: Scalars['ID'];
  user?: Maybe<User>;
  user_id: Scalars['ID'];
};

export type Message = {
  __typename?: 'Message';
  author: User;
  id: Scalars['ID'];
  text: Scalars['String'];
  time: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptMatch: Match;
  createMatch: Match;
  deleteEvent: Event;
  deleteMatch: Match;
  deleteUser?: Maybe<User>;
  editUser: User;
  postEvent: Event;
  postMessage: Message;
  postReview: Review;
};


export type MutationAcceptMatchArgs = {
  id: Scalars['ID'];
};


export type MutationCreateMatchArgs = {
  dismissed: Scalars['Boolean'];
  event_id: Scalars['ID'];
  user_id: Scalars['ID'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteMatchArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationEditUserArgs = {
  age: Scalars['Int'];
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  sex: Scalars['String'];
};


export type MutationPostEventArgs = {
  author_id: Scalars['ID'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  photo: Scalars['String'];
  slots: Scalars['Int'];
  text: Scalars['String'];
  time?: InputMaybe<Scalars['DateTime']>;
  title: Scalars['String'];
};


export type MutationPostMessageArgs = {
  author_id: Scalars['ID'];
  event_id: Scalars['ID'];
  text: Scalars['String'];
};


export type MutationPostReviewArgs = {
  author_id: Scalars['ID'];
  stars: Scalars['Int'];
  text: Scalars['String'];
  user_id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  event?: Maybe<Event>;
  events?: Maybe<Array<Maybe<Event>>>;
  feed?: Maybe<Array<Maybe<EventD>>>;
  lastEvent?: Maybe<Event>;
  matches?: Maybe<Array<Maybe<Match>>>;
  messages?: Maybe<Array<Maybe<Message>>>;
  reviews?: Maybe<Array<Maybe<Review>>>;
  user?: Maybe<User>;
};


export type QueryEventArgs = {
  id: Scalars['ID'];
};


export type QueryEventsArgs = {
  author_id: Scalars['ID'];
};


export type QueryFeedArgs = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  maxDistance: Scalars['Int'];
  user_id: Scalars['ID'];
};


export type QueryLastEventArgs = {
  author_id: Scalars['ID'];
};


export type QueryMatchesArgs = {
  user_id: Scalars['ID'];
};


export type QueryMessagesArgs = {
  event_id: Scalars['ID'];
};


export type QueryReviewsArgs = {
  user_id: Scalars['ID'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type Review = {
  __typename?: 'Review';
  author?: Maybe<User>;
  id: Scalars['ID'];
  stars: Scalars['Int'];
  text: Scalars['String'];
  time: Scalars['DateTime'];
  user?: Maybe<User>;
};

export type Subscription = {
  __typename?: 'Subscription';
  messages: Message;
};


export type SubscriptionMessagesArgs = {
  event_id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  age?: Maybe<Scalars['Int']>;
  avatar?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  messages?: Maybe<Array<Maybe<Message>>>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  recievedReviews?: Maybe<Array<Maybe<Review>>>;
  sex?: Maybe<Scalars['String']>;
  stars?: Maybe<Scalars['Int']>;
};

export type Delete_ProfileMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type Delete_ProfileMutation = { __typename?: 'Mutation', deleteUser?: { __typename?: 'User', id: string } | null };

export type Edit_ProfileMutationVariables = Exact<{
  id: Scalars['ID'];
  name: Scalars['String'];
  bio?: InputMaybe<Scalars['String']>;
  age: Scalars['Int'];
  sex: Scalars['String'];
  avatar?: InputMaybe<Scalars['String']>;
}>;


export type Edit_ProfileMutation = { __typename?: 'Mutation', editUser: { __typename?: 'User', id: string } };

export type Edit_Profile_QueryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type Edit_Profile_QueryQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null, age?: number | null, bio?: string | null, sex?: string | null } | null };

export type Profile_QueryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type Profile_QueryQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null, age?: number | null } | null };

export type My_MatchesQueryVariables = Exact<{
  user_id: Scalars['ID'];
}>;


export type My_MatchesQuery = { __typename?: 'Query', matches?: Array<{ __typename?: 'Match', id: string, event?: { __typename?: 'Event', id: string, title: string, time: any, photo: string } | null } | null> | null };

export type My_EventsQueryVariables = Exact<{
  author_id: Scalars['ID'];
}>;


export type My_EventsQuery = { __typename?: 'Query', events?: Array<{ __typename?: 'Event', id: string, title: string, time: any, photo: string } | null> | null };

export type Delete_MatchMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type Delete_MatchMutation = { __typename?: 'Mutation', deleteMatch: { __typename?: 'Match', id: string } };

export type Delete_EventMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type Delete_EventMutation = { __typename?: 'Mutation', deleteEvent: { __typename?: 'Event', id: string } };

export type Create_MatchMutationVariables = Exact<{
  dismissed: Scalars['Boolean'];
  event_id: Scalars['ID'];
  user_id: Scalars['ID'];
}>;


export type Create_MatchMutation = { __typename?: 'Mutation', createMatch: { __typename?: 'Match', id: string } };

export type FeedQueryVariables = Exact<{
  user_id: Scalars['ID'];
  maxDistance: Scalars['Int'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
}>;


export type FeedQuery = { __typename?: 'Query', feed?: Array<{ __typename?: 'EventD', id: string, author_id: string, title: string, text: string, time: any, photo: string, slots: number, latitude: number, longitude: number, distance: number, author?: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null } | null, matches?: Array<{ __typename?: 'Match', user?: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null } | null } | null> | null } | null> | null };

export type Last_EventQueryVariables = Exact<{
  author_id: Scalars['ID'];
}>;


export type Last_EventQuery = { __typename?: 'Query', lastEvent?: { __typename?: 'Event', id: string, title: string, photo: string, matches?: Array<{ __typename?: 'Match', id: string, accepted?: boolean | null, user?: { __typename?: 'User', id: string, avatar?: string | null, name?: string | null } | null } | null> | null } | null };

export type Accept_MatchMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type Accept_MatchMutation = { __typename?: 'Mutation', acceptMatch: { __typename?: 'Match', id: string } };

export type Post_MessageMutationVariables = Exact<{
  text: Scalars['String'];
  event_id: Scalars['ID'];
  author_id: Scalars['ID'];
}>;


export type Post_MessageMutation = { __typename?: 'Mutation', postMessage: { __typename?: 'Message', id: string } };

export type Event_QueryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type Event_QueryQuery = { __typename?: 'Query', event?: { __typename?: 'Event', id: string, author_id: string, title: string, text: string, time: any, slots: number, photo: string, latitude: number, longitude: number, author?: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null } | null, matches?: Array<{ __typename?: 'Match', id: string, accepted?: boolean | null, user?: { __typename?: 'User', id: string, avatar?: string | null, name?: string | null } | null } | null> | null } | null };

export type Post_ReviewMutationVariables = Exact<{
  author_id: Scalars['ID'];
  user_id: Scalars['ID'];
  stars: Scalars['Int'];
  text: Scalars['String'];
}>;


export type Post_ReviewMutation = { __typename?: 'Mutation', postReview: { __typename?: 'Review', id: string } };

export type Reviews_QueryQueryVariables = Exact<{
  user_id: Scalars['ID'];
}>;


export type Reviews_QueryQuery = { __typename?: 'Query', reviews?: Array<{ __typename?: 'Review', id: string, stars: number, text: string, time: any, author?: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null } | null } | null> | null };

export type User_QueryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type User_QueryQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null, age?: number | null, stars?: number | null, bio?: string | null, recievedReviews?: Array<{ __typename?: 'Review', id: string, time: any, text: string, stars: number, author?: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null } | null } | null> | null } | null };

export type Create_EventMutationVariables = Exact<{
  author_id: Scalars['ID'];
  title: Scalars['String'];
  text: Scalars['String'];
  photo: Scalars['String'];
  slots: Scalars['Int'];
  time: Scalars['DateTime'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
}>;


export type Create_EventMutation = { __typename?: 'Mutation', postEvent: { __typename?: 'Event', id: string } };


export const Delete_ProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DELETE_PROFILE"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Delete_ProfileMutation, Delete_ProfileMutationVariables>;
export const Edit_ProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EDIT_PROFILE"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bio"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"age"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sex"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"avatar"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"bio"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bio"}}},{"kind":"Argument","name":{"kind":"Name","value":"age"},"value":{"kind":"Variable","name":{"kind":"Name","value":"age"}}},{"kind":"Argument","name":{"kind":"Name","value":"sex"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sex"}}},{"kind":"Argument","name":{"kind":"Name","value":"avatar"},"value":{"kind":"Variable","name":{"kind":"Name","value":"avatar"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Edit_ProfileMutation, Edit_ProfileMutationVariables>;
export const Edit_Profile_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Edit_PROFILE_QUERY"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}}]}}]}}]} as unknown as DocumentNode<Edit_Profile_QueryQuery, Edit_Profile_QueryQueryVariables>;
export const Profile_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PROFILE_QUERY"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"age"}}]}}]}}]} as unknown as DocumentNode<Profile_QueryQuery, Profile_QueryQueryVariables>;
export const My_MatchesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MY_MATCHES"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"matches"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}}]}}]}}]}}]} as unknown as DocumentNode<My_MatchesQuery, My_MatchesQueryVariables>;
export const My_EventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MY_EVENTS"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"author_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"author_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"author_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}}]}}]}}]} as unknown as DocumentNode<My_EventsQuery, My_EventsQueryVariables>;
export const Delete_MatchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DELETE_MATCH"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMatch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Delete_MatchMutation, Delete_MatchMutationVariables>;
export const Delete_EventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DELETE_EVENT"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Delete_EventMutation, Delete_EventMutationVariables>;
export const Create_MatchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CREATE_MATCH"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dismissed"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMatch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dismissed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dismissed"}}},{"kind":"Argument","name":{"kind":"Name","value":"event_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Create_MatchMutation, Create_MatchMutationVariables>;
export const FeedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FEED"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maxDistance"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"latitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"longitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"maxDistance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maxDistance"}}},{"kind":"Argument","name":{"kind":"Name","value":"latitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"latitude"}}},{"kind":"Argument","name":{"kind":"Name","value":"longitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"longitude"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"author_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}},{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"distance"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"matches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FeedQuery, FeedQueryVariables>;
export const Last_EventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LAST_EVENT"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"author_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"author_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"author_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}},{"kind":"Field","name":{"kind":"Name","value":"matches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Last_EventQuery, Last_EventQueryVariables>;
export const Accept_MatchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ACCEPT_MATCH"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptMatch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Accept_MatchMutation, Accept_MatchMutationVariables>;
export const Post_MessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"POST_MESSAGE"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"author_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"event_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"author_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"author_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Post_MessageMutation, Post_MessageMutationVariables>;
export const Event_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"event_query"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"matches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Event_QueryQuery, Event_QueryQueryVariables>;
export const Post_ReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"POST_REVIEW"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"author_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stars"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"author_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"author_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"stars"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stars"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Post_ReviewMutation, Post_ReviewMutationVariables>;
export const Reviews_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"REVIEWS_QUERY"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stars"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<Reviews_QueryQuery, Reviews_QueryQueryVariables>;
export const User_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"USER_QUERY"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"stars"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"recievedReviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"stars"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}}]} as unknown as DocumentNode<User_QueryQuery, User_QueryQueryVariables>;
export const Create_EventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CREATE_EVENT"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"author_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"photo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slots"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"time"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"latitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"longitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"author_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"author_id"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"photo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"photo"}}},{"kind":"Argument","name":{"kind":"Name","value":"slots"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slots"}}},{"kind":"Argument","name":{"kind":"Name","value":"time"},"value":{"kind":"Variable","name":{"kind":"Name","value":"time"}}},{"kind":"Argument","name":{"kind":"Name","value":"latitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"latitude"}}},{"kind":"Argument","name":{"kind":"Name","value":"longitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"longitude"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Create_EventMutation, Create_EventMutationVariables>;