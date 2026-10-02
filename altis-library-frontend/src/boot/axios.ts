// import { defineBoot } from '#q-app'
// import axios, { type AxiosInstance } from 'axios'

// declare module 'vue' {
//   interface ComponentCustomProperties{
//     $axios: AxiosInstance
//     $api: AxiosInstance
//   }
// }

// const api = axios.create({
//   baseURL: process.env.API_URL || 'http://localhost:8080',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })

// // "async" is optional;
// // more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
// export default defineBoot(async ({ app, router}) => {
//   api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token')
//     if (token && config.headers){
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   })

//   api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if(error.response && error.response.status === 401) {
//         localStorage.removeItem('token')
//         void router.push('/login') 
//       }
//       return Promise.reject(new Error(error.message))

//   }
// )

//   app.config.globalProperties.$axios = api
//   app.config.globalProperties.$api = api

// })

// export { api }