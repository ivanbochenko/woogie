import { graphql } from "./gql"

export const EVENT_QUERY = graphql(`
  query event_query($id: String!) {
    event(id: $id) {
      id
      author {
        id
        name
        avatar
      }
      author_id
      title
      text
      time
      slots
      photo
      latitude
      longitude
      matches {
        id
        accepted
        user {
          id
          avatar
          name
        }
      }
    }
  }
`)

export const REVIEWS_QUERY = graphql(`
  query REVIEWS_QUERY($user_id: String!) {
    reviews(user_id: $user_id) {
      id
      stars
      text
      time
      author {
        id
        name
        avatar
      }
    }
  }
`)

export const USER_QUERY = graphql(`
  query USER_QUERY($id: String!) {
    user(id: $id) {
      id
      name
      avatar
      age
      stars
      bio
      recievedReviews {
        id
        time
        text
        stars
        author {
          id
          name
          avatar
        }
      }
    }
  }
`)

export const PROFILE_QUERY = graphql(`
  query PROFILE_QUERY($id: String!) {
    user(id: $id) {
      id
      name
      avatar
      age
      bio
      sex
    }
  }
`)

export const MY_MATCHES = graphql(`
  query MY_MATCHES($user_id: String!) {
    matches(user_id: $user_id) {
      id
      event {
        id
        title
        time
        photo
      }
    }
  }
`)

export const MY_EVENTS = graphql(`
  query MY_EVENTS($author_id: String!) {
    events(author_id: $author_id) {
      id
      title
      time
      photo
    }
  }
`)

export const FEED_QUERY = graphql(`
  query FEED($user_id: String!, $maxDistance: Int!, $latitude: Float!, $longitude: Float!) {
    feed(user_id: $user_id, maxDistance: $maxDistance, latitude: $latitude, longitude: $longitude) {
      id
      author_id
      title
      text
      time
      photo
      slots
      latitude
      longitude
      distance
      author {
        id
        name
        avatar
      }
      matches {
        user {
          id
          name
          avatar
        }
      }
    }
  }
`)

export const LAST_EVENT = graphql(`
  query LAST_EVENT($author_id: String!) {
    lastEvent(author_id: $author_id) {
      id
      title
      photo
      matches {
        id
        accepted
        user {
          id
          avatar
          name
        }
      }
    }
  }
`)

export const POST_MESSAGE = graphql(`
  mutation POST_MESSAGE($text: String!, $event_id: String!, $author_id: String!) {
    postMessage(text: $text, event_id: $event_id, author_id: $author_id) {
      id
    }
  }
`)

export const EDIT_PROFILE = graphql(`
  mutation EDIT_PROFILE($id: String!, $name: String!, $bio: String, $age: Int!, $sex: String!, $avatar: String) {
    editUser(id: $id, name: $name, bio: $bio, age: $age, sex: $sex, avatar: $avatar) {
      id
    }
  }
`)

export const ACCEPT_MATCH = graphql(`
  mutation ACCEPT_MATCH($id: String!) {
    acceptMatch(id: $id) {
      id
    }
  }
`)

export const DELETE_MATCH = graphql(`
  mutation DELETE_MATCH($id: String!) {
    deleteMatch(id: $id) {
      id
    }
  }
`)

export const DELETE_EVENT = graphql(`
  mutation DELETE_EVENT($id: String!) {
    deleteEvent(id: $id) {
      id
    }
  }
`)

export const CREATE_MATCH = graphql(`
  mutation CREATE_MATCH($dismissed: Boolean!, $event_id: String!, $user_id: String!) {
    createMatch(dismissed: $dismissed, event_id: $event_id, user_id: $user_id) {
      id
    }
  }
`)

export const CREATE_EVENT = graphql(`
  mutation CREATE_EVENT($author_id: String!, $title: String!, $text: String!, $photo: String!, $slots: Int!, $time: DateTime!, $latitude: Float!, $longitude: Float!) {
    postEvent(author_id: $author_id, title: $title, text: $text, photo: $photo, slots: $slots, time: $time, latitude: $latitude, longitude: $longitude) {
      id
    }
  }
`)

export const BLOCK = graphql(`
  mutation BLOCK($id: String!, $user_id: String!) {
    block(id: $id, user_id: $user_id)
  }
`)

export const POST_REVIEW = graphql(`
  mutation POST_REVIEW($author_id: String!, $user_id: String!, $stars: Int!, $text: String!) {
    postReview(author_id: $author_id, stars: $stars, text: $text, user_id: $user_id) {
      id
    }
  }
`)