import { createClient, defaultExchanges, subscriptionExchange } from 'urql'
import axios from 'axios'
import RNEventSource from 'react-native-event-source'
import { registerNotifications } from './Notification'

export const baseURL = 'https://woogie-server.herokuapp.com'
const gqlUrl = baseURL + '/graphql'
const timeout = 10000

export const apiClient = (token: string | undefined) => axios.create({
  baseURL,
  timeout,
  headers: {
    "Content-Type": "application/json",
    "Authorization": token ?? '',
  }
})

export const gqlClient = (token: string | undefined) => createClient({
  url: gqlUrl,
  fetchOptions: () => {
    return {
      headers: { Authorization: token ?? '' }
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
              // if (eventsource.readyState === 2) {
              //   sink.complete()
              // }
            })
            eventsource.addEventListener('error', (error) => {
              sink.error(error)
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
  const { status, data } = await apiClient('').post(`login`, {token, pushToken})
  if (status === 200) {
    return data
  } else {
    return null
  }
}