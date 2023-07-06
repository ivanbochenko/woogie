import { Client, cacheExchange, fetchExchange, subscriptionExchange } from 'urql'
import axios from 'axios'
import { API_URL } from '../constants/Config'
import { createClient as createSSEClient } from 'graphql-sse';

// const sseClient = createSSEClient({
//   url: API_URL + '/graphql/stream',
// });

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
    // subscriptionExchange({
    //   forwardSubscription(operation) {
    //     return {
    //       subscribe: (sink) => {
    //         const dispose = sseClient.subscribe({ ...operation, query: operation.query ?? ''}, sink);
    //         return {
    //           unsubscribe: dispose,
    //         };
    //       },
    //     };
    //   },
    // }),
  ],
})
