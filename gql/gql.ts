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
    "\n  mutation DELETE_PROFILE($id: ID!) {\n    deleteUser(id: $id) {\n      id\n    }\n  }\n": types.Delete_ProfileDocument,
    "\n  mutation EDIT_PROFILE($id: ID!, $name: String!, $bio: String, $age: Int!, $sex: String!, $avatar: String) {\n    editUser(id: $id, name: $name, bio: $bio, age: $age, sex: $sex, avatar: $avatar) {\n      id\n    }\n  }\n": types.Edit_ProfileDocument,
    "\n  query PROFILE_QUERY($id: ID!) {\n    user(id: $id) {\n      id\n      name\n      avatar\n      age\n      bio\n      sex\n    }\n  }\n": types.Profile_QueryDocument,
    "\n  query MY_MATCHES($user_id: ID!) {\n    matches(user_id: $user_id) {\n      id\n      event {\n        id\n        title\n        time\n        photo\n      }\n    }\n  }\n": types.My_MatchesDocument,
    "\n  query MY_EVENTS($author_id: ID!) {\n    events(author_id: $author_id) {\n      id\n      title\n      time\n      photo\n    }\n  }\n": types.My_EventsDocument,
    "\n  mutation DELETE_MATCH($id: ID!) {\n    deleteMatch(id: $id) {\n      id\n    }\n  }\n": types.Delete_MatchDocument,
    "\n  mutation DELETE_EVENT($id: ID!) {\n    deleteEvent(id: $id) {\n      id\n    }\n  }\n": types.Delete_EventDocument,
    "\n  mutation CREATE_MATCH($dismissed: Boolean!, $event_id: ID!, $user_id: ID!) {\n    createMatch(dismissed: $dismissed, event_id: $event_id, user_id: $user_id) {\n      id\n    }\n  }\n": types.Create_MatchDocument,
    "\n  query LAST_EVENT($author_id: ID!) {\n    lastEvent(author_id: $author_id) {\n      id\n      title\n      photo\n      matches {\n        id\n        accepted\n        user {\n          id\n          avatar\n          name\n        }\n      }\n    }\n  }\n": types.Last_EventDocument,
    "\n  mutation ACCEPT_MATCH($id: ID!) {\n    acceptMatch(id: $id) {\n      id\n    }\n  }\n": types.Accept_MatchDocument,
    "\n  mutation POST_MESSAGE($text: String!, $event_id: ID!, $author_id: ID!) {\n    postMessage(text: $text, event_id: $event_id, author_id: $author_id) {\n      id\n    }\n  }\n": types.Post_MessageDocument,
    "\n  query event_query($id: ID!) {\n    event(id: $id) {\n      id\n      author {\n        id\n        name\n        avatar\n      }\n      author_id\n      title\n      text\n      time\n      slots\n      photo\n      latitude\n      longitude\n      matches {\n        id\n        accepted\n        user {\n          id\n          avatar\n          name\n        }\n      }\n    }\n  }\n": types.Event_QueryDocument,
    "\n  mutation CREATE_EVENT($author_id: ID!, $title: String!, $text: String!, $photo: String!, $slots: Int!, $time: DateTime!, $latitude: Float!, $longitude: Float!) {\n    postEvent(author_id: $author_id, title: $title, text: $text, photo: $photo, slots: $slots, time: $time, latitude: $latitude, longitude: $longitude) {\n      id\n    }\n  }\n": types.Create_EventDocument,
    "\n  mutation POST_REVIEW($author_id: ID!, $user_id: ID!, $stars: Int!, $text: String!) {\n    postReview(author_id: $author_id, stars: $stars, text: $text, user_id: $user_id) {\n      id\n    }\n  }\n": types.Post_ReviewDocument,
    "\n  query REVIEWS_QUERY($user_id: ID!) {\n    reviews(user_id: $user_id) {\n      id\n      stars\n      text\n      time\n      author {\n        id\n        name\n        avatar\n      }\n    }\n  }\n": types.Reviews_QueryDocument,
    "\n  query USER_QUERY($id: ID!) {\n    user(id: $id) {\n      id\n      name\n      avatar\n      age\n      stars\n      bio\n      reviews {\n        id\n        time\n        text\n        stars\n        author {\n          id\n          name\n          avatar\n        }\n      }\n    }\n  }\n": types.User_QueryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DELETE_PROFILE($id: ID!) {\n    deleteUser(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DELETE_PROFILE($id: ID!) {\n    deleteUser(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EDIT_PROFILE($id: ID!, $name: String!, $bio: String, $age: Int!, $sex: String!, $avatar: String) {\n    editUser(id: $id, name: $name, bio: $bio, age: $age, sex: $sex, avatar: $avatar) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation EDIT_PROFILE($id: ID!, $name: String!, $bio: String, $age: Int!, $sex: String!, $avatar: String) {\n    editUser(id: $id, name: $name, bio: $bio, age: $age, sex: $sex, avatar: $avatar) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PROFILE_QUERY($id: ID!) {\n    user(id: $id) {\n      id\n      name\n      avatar\n      age\n      bio\n      sex\n    }\n  }\n"): (typeof documents)["\n  query PROFILE_QUERY($id: ID!) {\n    user(id: $id) {\n      id\n      name\n      avatar\n      age\n      bio\n      sex\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MY_MATCHES($user_id: ID!) {\n    matches(user_id: $user_id) {\n      id\n      event {\n        id\n        title\n        time\n        photo\n      }\n    }\n  }\n"): (typeof documents)["\n  query MY_MATCHES($user_id: ID!) {\n    matches(user_id: $user_id) {\n      id\n      event {\n        id\n        title\n        time\n        photo\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MY_EVENTS($author_id: ID!) {\n    events(author_id: $author_id) {\n      id\n      title\n      time\n      photo\n    }\n  }\n"): (typeof documents)["\n  query MY_EVENTS($author_id: ID!) {\n    events(author_id: $author_id) {\n      id\n      title\n      time\n      photo\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DELETE_MATCH($id: ID!) {\n    deleteMatch(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DELETE_MATCH($id: ID!) {\n    deleteMatch(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DELETE_EVENT($id: ID!) {\n    deleteEvent(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DELETE_EVENT($id: ID!) {\n    deleteEvent(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CREATE_MATCH($dismissed: Boolean!, $event_id: ID!, $user_id: ID!) {\n    createMatch(dismissed: $dismissed, event_id: $event_id, user_id: $user_id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CREATE_MATCH($dismissed: Boolean!, $event_id: ID!, $user_id: ID!) {\n    createMatch(dismissed: $dismissed, event_id: $event_id, user_id: $user_id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LAST_EVENT($author_id: ID!) {\n    lastEvent(author_id: $author_id) {\n      id\n      title\n      photo\n      matches {\n        id\n        accepted\n        user {\n          id\n          avatar\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query LAST_EVENT($author_id: ID!) {\n    lastEvent(author_id: $author_id) {\n      id\n      title\n      photo\n      matches {\n        id\n        accepted\n        user {\n          id\n          avatar\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ACCEPT_MATCH($id: ID!) {\n    acceptMatch(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation ACCEPT_MATCH($id: ID!) {\n    acceptMatch(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation POST_MESSAGE($text: String!, $event_id: ID!, $author_id: ID!) {\n    postMessage(text: $text, event_id: $event_id, author_id: $author_id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation POST_MESSAGE($text: String!, $event_id: ID!, $author_id: ID!) {\n    postMessage(text: $text, event_id: $event_id, author_id: $author_id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query event_query($id: ID!) {\n    event(id: $id) {\n      id\n      author {\n        id\n        name\n        avatar\n      }\n      author_id\n      title\n      text\n      time\n      slots\n      photo\n      latitude\n      longitude\n      matches {\n        id\n        accepted\n        user {\n          id\n          avatar\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query event_query($id: ID!) {\n    event(id: $id) {\n      id\n      author {\n        id\n        name\n        avatar\n      }\n      author_id\n      title\n      text\n      time\n      slots\n      photo\n      latitude\n      longitude\n      matches {\n        id\n        accepted\n        user {\n          id\n          avatar\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CREATE_EVENT($author_id: ID!, $title: String!, $text: String!, $photo: String!, $slots: Int!, $time: DateTime!, $latitude: Float!, $longitude: Float!) {\n    postEvent(author_id: $author_id, title: $title, text: $text, photo: $photo, slots: $slots, time: $time, latitude: $latitude, longitude: $longitude) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CREATE_EVENT($author_id: ID!, $title: String!, $text: String!, $photo: String!, $slots: Int!, $time: DateTime!, $latitude: Float!, $longitude: Float!) {\n    postEvent(author_id: $author_id, title: $title, text: $text, photo: $photo, slots: $slots, time: $time, latitude: $latitude, longitude: $longitude) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation POST_REVIEW($author_id: ID!, $user_id: ID!, $stars: Int!, $text: String!) {\n    postReview(author_id: $author_id, stars: $stars, text: $text, user_id: $user_id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation POST_REVIEW($author_id: ID!, $user_id: ID!, $stars: Int!, $text: String!) {\n    postReview(author_id: $author_id, stars: $stars, text: $text, user_id: $user_id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query REVIEWS_QUERY($user_id: ID!) {\n    reviews(user_id: $user_id) {\n      id\n      stars\n      text\n      time\n      author {\n        id\n        name\n        avatar\n      }\n    }\n  }\n"): (typeof documents)["\n  query REVIEWS_QUERY($user_id: ID!) {\n    reviews(user_id: $user_id) {\n      id\n      stars\n      text\n      time\n      author {\n        id\n        name\n        avatar\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query USER_QUERY($id: ID!) {\n    user(id: $id) {\n      id\n      name\n      avatar\n      age\n      stars\n      bio\n      reviews {\n        id\n        time\n        text\n        stars\n        author {\n          id\n          name\n          avatar\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query USER_QUERY($id: ID!) {\n    user(id: $id) {\n      id\n      name\n      avatar\n      age\n      stars\n      bio\n      reviews {\n        id\n        time\n        text\n        stars\n        author {\n          id\n          name\n          avatar\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;