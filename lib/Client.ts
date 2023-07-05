import { createClient, cacheExchange, fetchExchange, subscriptionExchange } from 'urql'
import axios from 'axios'
import { createClient as createSSEClient } from 'graphql-sse';
import { API_URL } from '../constants/Config'

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    "Accept": 'application/json'
  },
})

const sseClient = createSSEClient({
  url: API_URL + '/graphql/stream',
});

export const gqlClient = (token: string) => createClient({
  url: API_URL + '/graphql',
  fetchOptions: () => ({
    headers: { Authorization: token }
  }),
  exchanges: [
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(operation) {
        return {
          subscribe: (sink) => {
            const dispose = sseClient.subscribe({ ...operation, query: operation.query ?? ''}, sink);
            return {
              unsubscribe: dispose,
            };
          },
        };
      },
    }),
  ],
})
