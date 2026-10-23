<template>
  <q-page class="q-pa-lg bg-main-light">
    <div class="row items-center q-mb-lg">
      <h5 class="text-h5 text-weight-bold text-primary-text q-my-none">{{ t('dashboard.title', 'DASHBOARD') }}</h5>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card flat class="metric-card q-pa-md">
          <div class="row items-center justify-between no-wrap">
            <q-icon name="menu_book" size="2.8em" color="primary-text" />
            <div class="text-right">
              <div class="text-caption text-weight-bold text-primary-text">{{ t('dashboard.totalBooks', 'Total de Livros') }}</div>
              <div class="text-h4 text-weight-bolder text-primary-text q-mt-xs">{{ formatNumber(dashboardData.totalBooks) }}</div>
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat class="metric-card q-pa-md">
          <div class="row items-center justify-between no-wrap">
            <q-icon name="assignment" size="2.8em" color="primary-text" />
            <div class="text-right">
              <div class="text-caption text-weight-bold text-primary-text">{{ t('dashboard.activeLoans', 'Empréstimos Ativos') }}</div>
              <div class="text-h4 text-weight-bolder text-primary-text q-mt-xs">{{ formatNumber(dashboardData.activeLoans) }}</div>
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat class="metric-card q-pa-md">
          <div class="row items-center justify-between no-wrap">
            <q-icon name="event_note" size="2.8em" color="primary-text" />
            <div class="text-right">
              <div class="text-caption text-weight-bold text-primary-text">{{ t('dashboard.monthlyLoans', 'Empréstimos ao Mês') }}</div>
              <div class="text-h4 text-weight-bolder text-primary-text q-mt-xs">{{ formatNumber(dashboardData.monthlyLoans) }}</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <div class="table-container rounded-borders overflow-hidden">
      <div class="row items-center bg-dialog-header q-px-lg q-py-md border-bottom-subtle">
        <q-icon name="warning" size="1.6em" color="amber-9" class="q-mr-sm" />
        <span class="text-subtitle1 text-weight-bold text-primary-text">{{ t('dashboard.criticalAlerts', 'Alertas Críticos de Atraso') }}</span>
      </div>

      <q-markup-table flat borderless class="custom-table">
        <thead>
          <tr>
            <th class="text-center" style="width: 70px;">#</th>
            <th class="text-left">{{ t('dashboard.user', 'Usuário') }}</th>
            <th class="text-left">{{ t('dashboard.book', 'Livro') }}</th>
            <th class="text-center">{{ t('dashboard.daysOverdue', 'Dias de Atraso') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="4" class="text-center q-pa-lg"><q-spinner color="main-dark" size="2em" /></td></tr>
          <tr v-else-if="!dashboardData.criticalDelays || dashboardData.criticalDelays.length === 0">
            <td colspan="4" class="text-center text-grey-7 q-pa-lg">{{ t('dashboard.noDelays', 'Nenhum alerta de atraso crítico pendente.') }}</td>
          </tr>

          <tr v-for="(item, index) in dashboardData.criticalDelays" :key="index" class="table-row">
            <td class="text-center text-weight-bold text-primary-text">{{ index + 1 }}</td>
            <td class="text-left text-weight-medium text-primary-text">{{ getUserName(item) }}</td>
            <td class="text-left text-primary-text">{{ getBookTitle(item) }}</td>
            <td class="text-center">
              <span class="delay-badge">{{ getDaysOverdue(item) }} {{ t('dashboard.days', 'dias') }}</span>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { api } from '../../boot/axios'
import axios from 'axios'

interface CriticalDelayDTO {
  userName?: string
  name?: string
  user?: string
  bookTitle?: string
  title?: string
  book?: string
  daysOverdue?: number
  days?: number
  delayDays?: number
}

interface AdminDashboardResponse {
  totalBooks: number
  activeLoans: number
  monthlyLoans: number
  criticalDelays: CriticalDelayDTO[]
}

const { t } = useI18n()
const $q = useQuasar()

const loading = ref(false)
const dashboardData = ref<AdminDashboardResponse>({
  totalBooks: 0,
  activeLoans: 0,
  monthlyLoans: 0,
  criticalDelays: []
})

function formatNumber(val?: number): string {
  if (val === undefined || val === null) return '0'
  return val.toLocaleString('pt-BR')
}

function getUserName(item: CriticalDelayDTO): string {
  return item.userName || item.name || item.user || '-'
}

function getBookTitle(item: CriticalDelayDTO): string {
  return item.bookTitle || item.title || item.book || '-'
}

function getDaysOverdue(item: CriticalDelayDTO): number {
  return item.daysOverdue ?? item.days ?? item.delayDays ?? 0
}

async function fetchDashboardData() {
  loading.value = true
  try {
    const res = await api.get<AdminDashboardResponse>('/dashboard/admin')
    dashboardData.value = res.data
  } catch (e) {
    let msg = 'Erro ao carregar dados do Dashboard.'
    if (axios.isAxiosError(e)) {
      msg = e.response?.data?.message || msg
    }
    $q.notify({ type: 'negative', message: msg })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void fetchDashboardData()
})
</script>

<style scoped>
.bg-main-light {
  background-color: #FFF3D8;
}

.text-primary-text {
  color: #5C2A02;
}

.metric-card {
  background-color: #FFF3D8;
  border: 1.5px solid #D9A066;
  border-radius: 12px;
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

.delay-badge {
  color: #B10000;
  font-weight: 700;
  font-size: 0.95rem;
}
</style>