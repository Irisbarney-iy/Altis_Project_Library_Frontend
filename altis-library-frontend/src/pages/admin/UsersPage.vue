<template>
  <q-page class="q-pa-lg bg-main-light">
    <div class="row items-center q-mb-lg">
      <h5 class="text-h5 text-weight-bold text-primary-text q-my-none">
        {{ t('users.title') }}
      </h5>
    </div>

    <div class="row items-center justify-between q-mb-md gap-md">
      <div class="col-12 col-sm-6 col-md-4">
        <q-input v-model="searchTerm" outlined dense class="bg-white custom-search-input" :placeholder="t('users.searchPlaceholder')" @update:model-value="debounceSearch">
          <template #prepend>
            <q-icon name="search" color="grey-7" />
          </template>
        </q-input>
      </div>

      <div class="relative-position">
        <q-btn outline no-caps icon="tune" color="primary-text" class="btn-filter bg-white" :label="t('common.filter')">
          <q-menu auto-close anchor="bottom right" self="top right" class="filter-menu-popup">
            <div class="filter-menu-box">
              <div class="filter-option" :class="{ 'filter-option-active': selectedSort === 'name,asc' }" @click="applySort('name,asc')">
                A - Z
              </div>
              <div class="filter-option" :class="{ 'filter-option-active': selectedSort === 'name,desc' }" @click="applySort('name,desc')">
                Z - A
              </div>
              <div class="filter-option" :class="{ 'filter-option-active': selectedSort === 'id,desc' }" @click="applySort('id,desc')">
                {{ t('common.mostRecent', 'Mais Recente') }}
              </div>
            </div>
          </q-menu>
        </q-btn>
      </div>
    </div>

    <div class="table-container rounded-borders overflow-hidden">
      <q-markup-table flat borderless class="custom-table">
        <thead>
          <tr>
            <th class="text-left">{{ t('users.name') }}</th>
            <th class="text-left">{{ t('users.email') }}</th>
            <th class="text-left">{{ t('users.phone') }}</th>
            <th class="text-center">{{ t('users.status') }}</th>
            <th class="text-center">{{ t('users.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="text-center q-pa-lg">
              <q-spinner color="main-dark" size="2em" />
            </td>
          </tr>

          <tr v-else-if="users.length === 0">
            <td colspan="5" class="text-center text-grey-7 q-pa-lg">
              {{ t('users.noUsersFound') }}
            </td>
          </tr>

          <tr v-for="user in users" :key="user.id" class="table-row">
            <td class="text-left text-weight-medium text-primary-text">
              {{ user.fullName || user.name }}
            </td>
            <td class="text-left text-primary-text">
              {{ user.email }}
            </td>
            <td class="text-left text-primary-text">
              {{ user.phone || '-' }}
            </td>
            <td class="text-center">
              <span class="status-chip" :class="user.active ? 'status-active' : 'status-inactive'">
                {{ user.active ? t('users.active') : t('users.inactive') }}
              </span>
            </td>
            <td class="text-center">
              <q-toggle v-model="user.active" color="main-dark" keep-color dense :disable="toggleLoadingId === user.id" @update:model-value="(val) => handleToggleUserStatus(user, val)"/>
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <div class="row items-center justify-between q-pa-md pagination-bar">
        <div class="text-caption text-primary-text text-weight-medium">
          {{
            t('common.showingPagination', {
              from: paginationInfo.from,
              to: paginationInfo.to,
              total: paginationInfo.total
            })
          }}
        </div>

        <div class="row items-center q-gutter-xs">
          <q-btn outline dense icon="chevron_left" class="page-btn" :disable="currentPage === 0" @click="changePage(currentPage - 1)"/>

          <q-btn v-for="page in totalPages" :key="page" unelevated dense class="page-number-btn" :class="{ 'page-btn-active': page - 1 === currentPage }" :label="page" @click="changePage(page - 1)"/>

          <q-btn outline dense icon="chevron_right" class="page-btn" :disable="currentPage >= totalPages - 1" @click="changePage(currentPage + 1)"/>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { api } from '../../boot/axios'
import axios from 'axios'

interface UserItem {
  id: number
  fullName?: string
  name?: string
  email: string
  phone?: string
  cpf?: string
  active: boolean
}

interface SpringPageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

const { t } = useI18n()
const $q = useQuasar()

const users = ref<UserItem[]>([])
const loading = ref(false)
const toggleLoadingId = ref<number | null>(null)
const searchTerm = ref('')
const selectedSort = ref('name,asc')
const currentPage = ref(0)
const pageSize = ref(9)
const totalElements = ref(0)
const totalPages = ref(0)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const paginationInfo = computed(() => {
  if (totalElements.value === 0) {
    return { from: 0, to: 0, total: 0 }
  }
  const from = currentPage.value * pageSize.value + 1
  const to = Math.min((currentPage.value + 1) * pageSize.value, totalElements.value)
  return { from, to, total: totalElements.value }
})

async function fetchUsers() {
  loading.value = true

  try {
    const response = await api.get<SpringPageResponse<UserItem>>('/users/search', {
      params: {
        term: searchTerm.value.trim() || undefined,
        page: currentPage.value,
        size: pageSize.value,
        sort: selectedSort.value
      }
    })

    users.value = response.data.content
    totalElements.value = response.data.totalElements
    totalPages.value = response.data.totalPages
  } catch (error: unknown) {
    let message = 'Erro ao carregar lista de usuários.'
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message
    }
    $q.notify({ type: 'negative', message })
  } finally {
    loading.value = false
  }
}

function applySort(sortValue: string) {
  selectedSort.value = sortValue
  currentPage.value = 0
  void fetchUsers()
}

function debounceSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 0
    void fetchUsers()
  }, 400)
}

function changePage(page: number) {
  if (page < 0 || page >= totalPages.value) return
  currentPage.value = page
  void fetchUsers()
}

async function handleToggleUserStatus(user: UserItem, newStatus: boolean) {
  toggleLoadingId.value = user.id
  const endpoint = newStatus ? `/users/${user.id}/activate` : `/users/${user.id}/inactive`

  try {
    await api.patch(endpoint)

    $q.notify({
      type: 'positive',
      message: `Usuário ${newStatus ? 'ativado' : 'inativado'} com sucesso!`
    })
  } catch (error: unknown) {
    user.active = !newStatus

    let message = 'Falha ao alterar o status do usuário.'
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message
    }

    $q.notify({ type: 'negative', message })
  } finally {
    toggleLoadingId.value = null
  }
}

onMounted(() => {
  void fetchUsers()
})
</script>

<style scoped>
.bg-main-light {
  background-color: #FFF3D8;
}

.text-primary-text {
  color: #5C2A02;
}

.custom-search-input :deep(.q-field__control) {
  border-color: #D9A066;
  border-radius: 8px !important;
}

.btn-filter {
  border-color: #B15505 !important;
  color: #B15505 !important;
  border-radius: 8px;
}

:deep(.q-menu.filter-menu-popup) {
  background-color: #FFF3D8 !important;
  border: 1.5px solid #B15505 !important;
  border-radius: 12px !important;
  box-shadow: none !important;
  overflow: hidden !important;
}

.filter-menu-box {
  min-width: 130px;
}

.filter-option {
  text-align: center;
  padding: 8px 16px;
  color: #B15505;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.filter-option:not(:last-child) {
  border-bottom: 1.5px solid #B15505;
}

.filter-option:hover,
.filter-option-active {
  background-color: #F8E3C3;
  font-weight: 700;
}

.table-container {
  border: 1px solid #E5C396;
  background-color: #FFF3D8;
}

.custom-table {
  background-color: transparent;
  width: 100%;
}

.custom-table thead tr {
  background-color: #F8E3C3;
  border-bottom: 2px solid #E5C396;
}

.custom-table th {
  color: #5C2A02;
  font-weight: 700;
  font-size: 0.95rem;
}

.table-row {
  border-bottom: 1px solid #E5C396;
}

.table-row:last-child {
  border-bottom: none;
}

.status-chip {
  padding: 4px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-block;
}

.status-active {
  background-color: #D4EDDA;
  color: #155724;
}

.status-inactive {
  background-color: #F8D7DA;
  color: #721C24;
}

.pagination-bar {
  border-top: 1px solid #E5C396;
  background-color: #F8E3C3;
}

.page-btn {
  border-color: #B15505 !important;
  color: #B15505 !important;
  background-color: #FFFFFF;
  min-width: 32px;
}

.page-number-btn {
  background-color: #FFFFFF;
  color: #B15505;
  border: 1px solid #B15505;
  min-width: 32px;
}

.page-btn-active {
  background-color: #B15505 !important;
  color: #FFFFFF !important;
}
</style>