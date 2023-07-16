import { Client, cacheExchange, fetchExchange, subscriptionExchange } from 'urql'
// import { yogaExchange } from '@graphql-yoga/urql-exchange'
import axios from 'axios'
import { API_URL } from '../constants/Config'
import { createClient } from 'graphql-sse';

// 401 status
const sseClient = createClient({
  url: 'https://woogie-server.herokuapp.com' + '/graphql/stream',
});

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    "Accept": 'application/json'
  },
})

export const gqlClient = (Authorization: string) => new Client({
  url: API_URL + '/graphql',
  fetchOptions: () => ({ headers: { Authorization } }),
  exchanges: [
    cacheExchange,
    fetchExchange,
    // yogaExchange(),
    subscriptionExchange({
      forwardSubscription(operation) {
        return {
          subscribe: (sink) => {
            const input = { ...operation, query: operation.query || '' }
            const unsubscribe = sseClient.subscribe(input, sink)
            return { unsubscribe }
          },
        };
      },
    }),
  ],
})
