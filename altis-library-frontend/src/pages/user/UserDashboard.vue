<template>
  <q-page class="q-pa-lg bg-main-light">
    <div class="row items-center justify-between q-mb-lg">
      <h5 class="text-h5 text-weight-bold text-primary-text q-my-none">{{ t('userDashboard.title', 'DASHBOARD') }}</h5>
      <div class="row items-center date-badge q-px-md q-py-xs rounded-borders">
        <q-icon name="event" size="1.4em" color="primary-text" class="q-mr-xs" />
        <span class="text-subtitle2 text-weight-bold text-primary-text">{{ currentDateFormatted }}</span>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card flat class="metric-card q-pa-md">
          <div class="row items-center justify-between no-wrap">
            <q-icon name="import_contacts" size="2.8em" color="primary-text" />
            <div class="text-right">
              <div class="text-caption text-weight-bold text-primary-text">{{ t('userDashboard.activeLoans', 'Empréstimos Ativos') }}</div>
              <div class="text-h4 text-weight-bolder text-primary-text q-mt-xs">{{ dashboardData.activeLoans }}</div>
              <div class="text-caption text-grey-7">{{ t('userDashboard.booksWithYou', 'Livros com você') }}</div>
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat class="metric-card q-pa-md" :class="{ 'card-alert-overdue': dashboardData.totalDelays > 0 }">
          <div class="row items-center justify-between no-wrap">
            <q-icon name="assignment_late" size="2.8em" :color="dashboardData.totalDelays > 0 ? 'negative' : 'primary-text'" />
            <div class="text-right">
              <div class="text-caption text-weight-bold" :class="dashboardData.totalDelays > 0 ? 'text-negative' : 'text-primary-text'">
                {{ t('userDashboard.delays', 'Atrasos') }}
              </div>
              <div class="text-h4 text-weight-bolder q-mt-xs" :class="dashboardData.totalDelays > 0 ? 'text-negative' : 'text-primary-text'">
                {{ dashboardData.totalDelays }}
              </div>
              <div class="text-caption" :class="dashboardData.totalDelays > 0 ? 'text-negative' : 'text-grey-7'">
                {{ t('userDashboard.booksOverdue', 'Livros em atraso') }}
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat class="metric-card q-pa-md">
          <div class="row items-center justify-between no-wrap">
            <q-icon name="history" size="2.8em" color="primary-text" />
            <div class="text-right">
              <div class="text-caption text-weight-bold text-primary-text">{{ t('userDashboard.withdrawals', 'Retiradas') }}</div>
              <div class="text-h4 text-weight-bolder text-primary-text q-mt-xs">{{ dashboardData.totalReturned }}</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <div class="table-container rounded-borders overflow-hidden">
      <div class="row items-center bg-dialog-header q-px-lg q-py-md border-bottom-subtle">
        <q-icon name="menu_book" size="1.6em" color="primary-text" class="q-mr-sm" />
        <span class="text-subtitle1 text-weight-bold text-primary-text">{{ t('userDashboard.myBooks', 'Meus livros') }}</span>
      </div>

      <q-markup-table flat borderless class="custom-table">
        <thead>
          <tr>
            <th class="text-left">{{ t('userDashboard.book', 'Livro') }}</th>
            <th class="text-left">{{ t('userDashboard.author', 'Autor') }}</th>
            <th class="text-left">{{ t('userDashboard.loanDate', 'Data Aluguel') }}</th>
            <th class="text-left">{{ t('userDashboard.limitTerm', 'Prazo') }}</th>
            <th class="text-center">{{ t('userDashboard.daysOverdue', 'Dias de Atraso') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="5" class="text-center q-pa-lg"><q-spinner color="main-dark" size="2em" /></td></tr>
          <tr v-else-if="!dashboardData.myBooks || dashboardData.myBooks.length === 0">
            <td colspan="5" class="text-center text-grey-7 q-pa-lg">{{ t('userDashboard.noBooks', 'Você não possui livros alugados no momento.') }}</td>
          </tr>

          <tr v-for="(book, index) in dashboardData.myBooks" :key="index" class="table-row">
            <td class="text-left text-weight-medium text-primary-text">{{ getBookTitle(book) }}</td>
            <td class="text-left text-primary-text">{{ book.author || '-' }}</td>
            <td class="text-left text-primary-text">{{ formatDate(book.loanDate) }}</td>
            <td class="text-left text-primary-text">{{ formatDate(book.limitTerm) }}</td>
            <td class="text-center">
              <span :class="book.daysOverdue > 0 ? 'text-red-alert' : 'text-grey-7'">
                {{ book.daysOverdue }} {{ t('userDashboard.days', 'dias') }}
              </span>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { api } from '../../boot/axios'
import axios from 'axios'

interface NestedBook {
  title?: string
}

interface MyBookDTO {
  title?: string
  bookTitle?: string
  book?: NestedBook | string
  author?: string
  loanDate?: string | null
  limitTerm?: string | null
  daysOverdue: number
}

interface UserDashboardResponse {
  activeLoans: number
  totalDelays: number
  totalReturned: number
  myBooks: MyBookDTO[]
}

const { t } = useI18n()
const $q = useQuasar()

const loading = ref(false)
const dashboardData = ref<UserDashboardResponse>({
  activeLoans: 0,
  totalDelays: 0,
  totalReturned: 0,
  myBooks: []
})

const currentDateFormatted = computed(() => {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()
  return `${day}/${month}/${year}`
})

function getBookTitle(item: MyBookDTO): string {
  if (item.title) return item.title
  if (item.bookTitle) return item.bookTitle
  if (typeof item.book === 'object' && item.book?.title) return item.book.title
  if (typeof item.book === 'string') return item.book
  return '-'
}

function formatDate(dateVal?: string | null): string {
  if (!dateVal) return '---'
  const str = String(dateVal).trim()
  if (!str || str === 'null') return '---'
  const datePart = str.split('T')[0] ?? str
  const parts = datePart.split('-')
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`
  }
  return str
}

async function fetchUserDashboard() {
  loading.value = true
  try {
    const res = await api.get<UserDashboardResponse>('/dashboard/user')
    dashboardData.value = res.data
  } catch (e) {
    let msg = 'Erro ao carregar seu dashboard.'
    if (axios.isAxiosError(e)) {
      msg = e.response?.data?.message || msg
    }
    $q.notify({ type: 'negative', message: msg })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void fetchUserDashboard()
})
</script>

<style scoped>
.bg-main-light {
  background-color: #FFF3D8;
}

.text-primary-text {
  color: #5C2A02;
}

.date-badge {
  background-color: #F8E3C3;
  border: 1px solid #D9A066;
}

.metric-card {
  background-color: #FFF3D8;
  border: 1.5px solid #D9A066;
  border-radius: 12px;
}

.card-alert-overdue {
  border: 1.5px solid #C10015 !important;
  background-color: #FFF0F0 !important;
}

.table-container {
  border: 1.5px solid #E5C396;
  background-color: #FFF3D8;
}

.bg-dialog-header {
  background-color: #F8E3C3;
}

.border-bottom-subtle {
  border-bottom: 1.5px solid #E5C396;
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

.text-red-alert {
  color: #C10015;
  font-weight: 700;
}
</style>