import { Client, cacheExchange, fetchExchange } from 'urql'
import axios from 'axios'
import { API_URL } from '../constants/Config'
import { edenTreaty } from '@elysiajs/eden'
import type { App } from '../../backend/src'

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    "Accept": 'application/json'
  },
})

export const app = edenTreaty<App>('http://3.76.16.210')

export const gqlClient = (Authorization: string) => new Client({
  url: API_URL + '/graphql',
  fetchOptions: () => ({ headers: { Authorization } }),
  exchanges: [
    cacheExchange,
    fetchExchange
  ],
})
