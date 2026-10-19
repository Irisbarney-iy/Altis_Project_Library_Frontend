import { defineBoot } from '#q-app'
import axios, { type AxiosInstance } from 'axios'
import { LocalStorage } from 'quasar'

declare module 'vue' {
  interface ComponentCustomProperties{
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

const getBaseUrl = (): string => {
  if (typeof process !== 'undefined' && process.env?.API_URL){
    return process.env.API_URL
  }
  return 'http://localhost:8080'    
}

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
})

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(({ app, router}) => {
  api.interceptors.request.use((config) => {
    const token = LocalStorage.getItem<string>('token')
    if (token && config.headers){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if(error.response && error.response.status === 401) {
        LocalStorage.removeItem('token')
        void router.push('/login') 
      }
      return Promise.reject(error instanceof Error ? error : new Error(String(error)))

  }
)

  app.config.globalProperties.$axios = api
  app.config.globalProperties.$api = api

})

export { api }