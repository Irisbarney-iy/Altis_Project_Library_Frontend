import type { RouteRecordRaw } from 'vue-router'
import { Permissions } from '../constants/permissions.constants'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../pages/auth/LoginPage.vue')
  },
  {
    path: '/register',
    component: () => import('../pages/auth/RegisterPage.vue')
  },
  {
    path: '/forgot-password',
    component: () => import('../pages/auth/ForgotPasswordPage.vue')
  },
  {
    path: '/auth/recover-password/reset',
    component: () => import('../pages/auth/ResetPasswordPage.vue')
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissions: [Permissions.ADMIN] },
    children: [
      { path: 'dashboard', component: () => import('../pages/AdminDashboard.vue') }
    ]
  },
  {
    path: '/user',
    component: () => import('../layouts/UserLayout.vue'),
    meta: { permissions: [Permissions.USER] },
    children: [
      { path: 'dashboard', component: () => import('../pages/UserDashboard.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue')
  }
]

export default routes