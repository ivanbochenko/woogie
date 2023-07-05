/* eslint-disable */
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
};

export type Event = {
  __typename?: 'Event';
  author?: Maybe<User>;
  author_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  matches?: Maybe<Array<Maybe<Match>>>;
  photo: Scalars['String']['output'];
  slots: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  time: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
};

export type EventD = {
  __typename?: 'EventD';
  author?: Maybe<User>;
  author_id: Scalars['String']['output'];
  distance: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  matches?: Maybe<Array<Maybe<Match>>>;
  photo: Scalars['String']['output'];
  slots: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  time: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
};

export type Match = {
  __typename?: 'Match';
  accepted?: Maybe<Scalars['Boolean']['output']>;
  dissmised?: Maybe<Scalars['Boolean']['output']>;
  event?: Maybe<Event>;
  event_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  user?: Maybe<User>;
  user_id: Scalars['String']['output'];
};

export type Message = {
  __typename?: 'Message';
  author: User;
  id: Scalars['String']['output'];
  text: Scalars['String']['output'];
  time: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptMatch?: Maybe<Match>;
  block?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  createMatch?: Maybe<Match>;
  deleteEvent?: Maybe<Event>;
  deleteMatch?: Maybe<Match>;
  editUser?: Maybe<User>;
  postEvent: Event;
  postMessage?: Maybe<Message>;
  postReview?: Maybe<Review>;
};


export type MutationAcceptMatchArgs = {
  id: Scalars['String']['input'];
};


export type MutationBlockArgs = {
  id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};


export type MutationCreateMatchArgs = {
  dismissed: Scalars['Boolean']['input'];
  event_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMatchArgs = {
  id: Scalars['String']['input'];
};


export type MutationEditUserArgs = {
  age: Scalars['Int']['input'];
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  sex: Scalars['String']['input'];
};


export type MutationPostEventArgs = {
  author_id: Scalars['String']['input'];
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  photo: Scalars['String']['input'];
  slots: Scalars['Int']['input'];
  text: Scalars['String']['input'];
  time?: InputMaybe<Scalars['DateTime']['input']>;
  title: Scalars['String']['input'];
};


export type MutationPostMessageArgs = {
  author_id: Scalars['String']['input'];
  event_id: Scalars['String']['input'];
  text: Scalars['String']['input'];
};


export type MutationPostReviewArgs = {
  author_id: Scalars['String']['input'];
  stars: Scalars['Int']['input'];
  text: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
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
  id: Scalars['String']['input'];
};


export type QueryEventsArgs = {
  author_id: Scalars['String']['input'];
};


export type QueryFeedArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  maxDistance: Scalars['Int']['input'];
  user_id: Scalars['String']['input'];
};


export type QueryLastEventArgs = {
  author_id: Scalars['String']['input'];
};


export type QueryMatchesArgs = {
  user_id: Scalars['String']['input'];
};


export type QueryMessagesArgs = {
  event_id: Scalars['String']['input'];
};


export type QueryReviewsArgs = {
  user_id: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};

export type Review = {
  __typename?: 'Review';
  author?: Maybe<User>;
  id: Scalars['String']['output'];
  stars: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  time: Scalars['DateTime']['output'];
  user?: Maybe<User>;
};

export type Subscription = {
  __typename?: 'Subscription';
  messages: Message;
};


export type SubscriptionMessagesArgs = {
  event_id: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  age?: Maybe<Scalars['Int']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  messages?: Maybe<Array<Maybe<Message>>>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  recievedReviews?: Maybe<Array<Maybe<Review>>>;
  sex?: Maybe<Scalars['String']['output']>;
  stars?: Maybe<Scalars['Int']['output']>;
};
