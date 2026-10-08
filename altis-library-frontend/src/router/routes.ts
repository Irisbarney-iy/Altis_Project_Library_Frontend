import type { RouteRecordRaw } from 'vue-router'
import { Permissions } from '../constants/permissions.constants'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/admin/dashboard'
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