import { createClient, cacheExchange, fetchExchange } from 'urql'
import axios from 'axios'
import { API_URL } from '../constants/Config'
import { yogaExchange } from '@graphql-yoga/urql-exchange'

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    "Accept": 'application/json'
  },
})

export const gqlClient = (token: string) => createClient({
  url: API_URL + '/graphql',
  fetchOptions: () => ({
    headers: { Authorization: token }
  }),
  exchanges: [
    cacheExchange,
    fetchExchange,
    yogaExchange(),
  ],
})