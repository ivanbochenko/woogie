import { createClient, defaultExchanges, subscriptionExchange } from 'urql'
import axios from 'axios'
import RNEventSource from 'react-native-event-source'
import { registerNotifications } from './Notification'

export const baseURL = 'https://woogie-server.herokuapp.com'
const gqlUrl = baseURL + '/graphql'

export const apiClient = () => axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export const gqlClient = (token: string) => createClient({
  url: gqlUrl,
  fetchOptions: () => {
    return {
      headers: { Authorization: token }
    };
  },
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        const url = new URL(gqlUrl)
        url.searchParams.append('query', operation.query)
        if (operation.variables) {
          url.searchParams.append(
            'variables',
            JSON.stringify(operation.variables),
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

export const refreshToken = async (token: string) => {
  const pushToken = await registerNotifications()
  const { status, data } = await apiClient().post(`login`, {token, pushToken})
  if (status === 200) {
    return data
  } else {
    return null
  }
}