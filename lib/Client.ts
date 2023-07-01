import { createClient, cacheExchange, fetchExchange, subscriptionExchange } from 'urql'
import axios from 'axios'
import RNEventSource from 'react-native-event-source'
import { API_URL } from '../constants/Config'

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    "Accept": 'application/json'
  },
})

export const gqlClient = (token: string) => createClient({
  url: API_URL + '/graphql',
  fetchOptions: () => {
    return {
      headers: { Authorization: token }
    };
  },
  exchanges: [
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(request) {
        const url = new URL(API_URL + '/graphql')
        url.searchParams.append('query', request.query || '')
        if (request.variables) {
          url.searchParams.append(
            'variables',
            JSON.stringify(request.variables),
          )
        }
        return {
          subscribe: (sink) => {
            const eventsource = new RNEventSource(url.toString(), {
              headers: { Authorization: token }
            })
            eventsource.addEventListener('message', (event) => {
              const data = JSON.parse(event.data!)
              sink.next(data)
            })
            eventsource.addEventListener('error', (error) => {
              sink.error(error)
            })
            eventsource.addEventListener('complete', () => {
              eventsource.close()
            })
            return {
              unsubscribe: () => {
                eventsource.removeAllListeners();
                eventsource.close();
              },
            }
          },
        }
      },
    }),
  ],
})