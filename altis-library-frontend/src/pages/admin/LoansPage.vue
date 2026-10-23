<template>
  <q-page class="q-pa-lg bg-main-light">
    <div class="row items-center q-mb-lg">
      <h5 class="text-h5 text-weight-bold text-primary-text q-my-none">{{ t('loans.title') }}</h5>
    </div>

    <div class="row items-center justify-between q-mb-md gap-md">
      <div class="col-12 col-sm-6 col-md-4">
        <q-input v-model="searchTerm" outlined dense class="bg-white custom-search-input" :placeholder="t('loans.searchPlaceholder')" @update:model-value="debounceSearch">
          <template #prepend><q-icon name="search" color="grey-7" /></template>
        </q-input>
      </div>

      <div class="row items-center q-gutter-sm">
        <q-btn outline no-caps icon="tune" color="primary-text" class="btn-filter bg-white" :label="t('common.filter')">
          <q-menu auto-close anchor="bottom right" self="top right" class="filter-menu-popup">
            <div class="filter-menu-box">
              <div class="filter-option" :class="{ 'filter-option-active': selectedSort === 'loanDate,asc' }" @click="applySort('loanDate,asc')">A - Z</div>
              <div class="filter-option" :class="{ 'filter-option-active': selectedSort === 'loanDate,desc' }" @click="applySort('loanDate,desc')">Z - A</div>
              <div class="filter-option" :class="{ 'filter-option-active': selectedSort === 'id,desc' }" @click="applySort('id,desc')">{{ t('common.mostRecent') }}</div>
            </div>
          </q-menu>
        </q-btn>

        <q-btn unelevated no-caps icon="add" class="btn-add-loan" :label="t('loans.newLoan')" @click="openCreateDialog" />
      </div>
    </div>

    <div class="table-container rounded-borders overflow-hidden">
      <q-markup-table flat borderless class="custom-table">
        <thead>
          <tr>
            <th class="text-left">{{ t('loans.renter') }}</th>
            <th class="text-left">{{ t('loans.book') }}</th>
            <th class="text-left">{{ t('loans.loanDate') }}</th>
            <th class="text-left">{{ t('loans.limitTerm') }}</th>
            <th class="text-left">{{ t('loans.returnDate') }}</th>
            <th class="text-center">{{ t('loans.status') }}</th>
            <th class="text-center">{{ t('loans.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="7" class="text-center q-pa-lg"><q-spinner color="main-dark" size="2em" /></td></tr>
          <tr v-else-if="loans.length === 0"><td colspan="7" class="text-center text-grey-7 q-pa-lg">{{ t('loans.noLoansFound') }}</td></tr>

          <tr v-for="loan in loans" :key="loan.id" class="table-row">
            <td class="text-left text-weight-medium text-primary-text">{{ getRenterDisplay(loan) }}</td>
            <td class="text-left text-primary-text">{{ getBookDisplay(loan) }}</td>
            <td class="text-left text-primary-text">{{ formatDate(loan.loanDate || loan.rentedDate) }}</td>
            <td class="text-left text-primary-text">{{ formatDate(loan.termLimit || loan.limitTerm || loan.dueDate) }}</td>
            <td class="text-left text-primary-text">{{ formatDate(loan.returnDate || loan.returnedDate || loan.deliveryDate) }}</td>
            <td class="text-center">
              <span class="status-chip" :class="getStatusClass(loan.status)">{{ getStatusLabel(loan.status) }}</span>
            </td>
            <td class="text-center">
              <div class="row justify-center items-center q-gutter-xs">
                <q-btn outline no-caps dense class="btn-renew" :label="t('loans.renew')" :disable="isRenewDisabled(loan)" @click="openRenewDialog(loan)" />
                <q-btn flat dense icon="file_download" class="action-btn-return" :disable="isReturnDisabled(loan)" @click="openReturnDialog(loan)" />
              </div>
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <div class="row items-center justify-between q-pa-md pagination-bar">
        <div class="text-caption text-primary-text text-weight-medium">
          {{ t('common.showingPagination', { from: paginationInfo.from, to: paginationInfo.to, total: paginationInfo.total }) }}
        </div>
        <div class="row items-center q-gutter-xs">
          <q-btn outline dense icon="chevron_left" class="page-btn" :disable="currentPage === 0" @click="changePage(currentPage - 1)" />
          <q-btn v-for="page in totalPages" :key="page" unelevated dense class="page-number-btn" :class="{ 'page-btn-active': page - 1 === currentPage }" :label="page" @click="changePage(page - 1)" />
          <q-btn outline dense icon="chevron_right" class="page-btn" :disable="currentPage >= totalPages - 1" @click="changePage(currentPage + 1)" />
        </div>
      </div>
    </div>

    <q-dialog v-model="isCreateDialogOpen" persistent>
      <q-card class="dialog-card">
        <q-card-section class="row items-center justify-between bg-dialog-header q-px-lg q-py-md">
          <div class="text-h6 text-weight-bold text-primary-text">{{ t('loans.dialog.createTitle') }}</div>
          <q-btn icon="close" flat round dense v-close-popup color="primary-text" />
        </q-card-section>

        <q-card-section class="q-px-lg q-py-md">
          <q-form @submit="handleCreateLoan" class="q-gutter-y-sm">
            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('loans.renter') }}</div>
              <q-select v-model="createForm.userId" outlined dense emit-value map-options hide-bottom-space :options="userOptions" class="modal-input" :rules="[val => !!val || t('loans.dialog.userRequired')]" />
            </div>
            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('loans.book') }}</div>
              <q-select v-model="createForm.bookId" outlined dense emit-value map-options hide-bottom-space :options="bookOptions" class="modal-input" :rules="[val => !!val || t('loans.dialog.bookRequired')]" />
            </div>
            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('loans.limitTerm') }}</div>
              <q-input v-model="createForm.limitTerm" outlined dense type="date" hide-bottom-space class="modal-input" :rules="[val => !!val || t('loans.dialog.termRequired')]" />
            </div>
            <div class="row justify-end q-gutter-sm q-pt-md">
              <q-btn outline no-caps class="btn-cancel" :label="t('common.cancel')" v-close-popup />
              <q-btn unelevated no-caps type="submit" class="btn-save" :label="t('common.save')" :loading="submitting" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isRenewDialogOpen" persistent>
      <q-card class="dialog-card">
        <q-card-section class="row items-center justify-between bg-dialog-header q-px-lg q-py-md">
          <div class="text-h6 text-weight-bold text-primary-text">{{ t('loans.dialog.renewTitle') }}</div>
          <q-btn icon="close" flat round dense v-close-popup color="primary-text" />
        </q-card-section>

        <q-card-section class="q-px-lg q-py-md">
          <div class="q-mb-md text-primary-text">
            <div><strong>{{ t('loans.renter') }}:</strong> {{ selectedLoanForRenew ? getRenterDisplay(selectedLoanForRenew) : '' }}</div>
            <div><strong>{{ t('loans.book') }}:</strong> {{ selectedLoanForRenew ? getBookDisplay(selectedLoanForRenew) : '' }}</div>
          </div>
          <q-form @submit="handleRenewLoan" class="q-gutter-y-sm">
            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('loans.dialog.newTerm') }}</div>
              <q-input v-model="renewForm.newTerm" outlined dense type="date" hide-bottom-space class="modal-input" :rules="[val => !!val || t('loans.dialog.termRequired')]" />
            </div>
            <div class="row justify-end q-gutter-sm q-pt-md">
              <q-btn outline no-caps class="btn-cancel" :label="t('common.cancel')" v-close-popup />
              <q-btn unelevated no-caps type="submit" class="btn-save" :label="t('loans.renew')" :loading="submitting" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isReturnDialogOpen" persistent>
      <q-card class="dialog-card">
        <q-card-section class="row items-center justify-between bg-dialog-header">
          <div class="text-h6 text-weight-bold text-primary-text">{{ t('loans.dialog.returnTitle') }}</div>
          <q-btn icon="close" flat round dense v-close-popup color="primary-text" />
        </q-card-section>

        <q-card-section class="q-pa-md text-body1 text-primary-text">
          {{ t('loans.dialog.returnConfirmMessage', { book: selectedLoanForReturn ? getBookDisplay(selectedLoanForReturn) : '', user: selectedLoanForReturn ? getRenterDisplay(selectedLoanForReturn) : '' }) }}
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md q-px-md">
          <q-btn outline no-caps class="btn-cancel" :label="t('common.cancel')" v-close-popup />
          <q-btn unelevated no-caps class="btn-save" :label="t('common.confirm')" :loading="returning" @click="handleReturnLoan" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { api } from '../../boot/axios'
import axios from 'axios'

interface UserNested {
  id: number
  fullName?: string
  name?: string
  email?: string
}

interface BookNested {
  id: number
  title: string
}

interface Loan {
  id?: number
  user?: UserNested | string | null
  userName?: string | null
  book?: BookNested | string | null
  bookTitle?: string | null
  loanDate?: string | null
  rentedDate?: string | null
  limitTerm?: string | null
  termLimit?: string | null
  dueDate?: string | null
  returnDate?: string | null
  returnedDate?: string | null
  deliveryDate?: string | null
  status?: string | null
}

interface SelectOption {
  label: string
  value: number
}

interface SpringPageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
}

const { t } = useI18n()
const $q = useQuasar()

const loans = ref<Loan[]>([])
const loading = ref(false)
const submitting = ref(false)
const returning = ref(false)
const searchTerm = ref('')
const selectedSort = ref('loanDate,desc')
const currentPage = ref(0)
const pageSize = ref(9)
const totalElements = ref(0)
const totalPages = ref(0)

const userOptions = ref<SelectOption[]>([])
const bookOptions = ref<SelectOption[]>([])

const isCreateDialogOpen = ref(false)
const createForm = reactive({
  userId: null as number | null,
  bookId: null as number | null,
  limitTerm: ''
})

const isRenewDialogOpen = ref(false)
const selectedLoanForRenew = ref<Loan | null>(null)
const renewForm = reactive({
  loanId: undefined as number | undefined,
  newTerm: ''
})

const isReturnDialogOpen = ref(false)
const selectedLoanForReturn = ref<Loan | null>(null)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const paginationInfo = computed(() => {
  if (!totalElements.value) return { from: 0, to: 0, total: 0 }
  const from = currentPage.value * pageSize.value + 1
  const to = Math.min((currentPage.value + 1) * pageSize.value, totalElements.value)
  return { from, to, total: totalElements.value }
})

function formatDate(dateVal?: string | null): string {
  if (!dateVal) return '---'
  const str = String(dateVal).trim()
  if (!str || str === 'null' || str === 'undefined') return '---'
  const datePart = str.split('T')[0] ?? str
  const parts = datePart.split('-')
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`
  }
  return str
}

function getRenterDisplay(loan: Loan): string {
  if (typeof loan.user === 'object' && loan.user) {
    return loan.user.fullName || loan.user.name || loan.user.email || '-'
  }
  return typeof loan.user === 'string' ? loan.user : loan.userName || '-'
}

function getBookDisplay(loan: Loan): string {
  if (typeof loan.book === 'object' && loan.book) {
    return loan.book.title
  }
  return typeof loan.book === 'string' ? loan.book : loan.bookTitle || '-'
}

function getStatusLabel(status?: string | null): string {
  const statusMap: Record<string, string> = {
    RENTED: t('loans.statusTypes.rented', 'No Prazo'),
    OVERDUE: t('loans.statusTypes.overdue', 'Atrasado'),
    RETURNED_ON_TIME: t('loans.statusTypes.returnedOnTime', 'Entre.NP'),
    RETURNED_WITH_DELAY: t('loans.statusTypes.returnedWithDelay', 'Entre.CA')
  }
  return (status && statusMap[status]) || status || '-'
}

function getStatusClass(status?: string | null): string {
  const classMap: Record<string, string> = {
    RENTED: 'status-rented',
    OVERDUE: 'status-overdue',
    RETURNED_ON_TIME: 'status-returned-ok',
    RETURNED_WITH_DELAY: 'status-returned-delay'
  }
  return (status && classMap[status]) || 'status-default'
}

function isRenewDisabled(loan: Loan): boolean {
  const hasReturned = !!(loan.returnDate || loan.returnedDate || loan.deliveryDate)
  const isFinalizedStatus = ['OVERDUE', 'RETURNED_ON_TIME', 'RETURNED_WITH_DELAY'].includes(loan.status ?? '')
  return hasReturned || isFinalizedStatus
}

function isReturnDisabled(loan: Loan): boolean {
  const hasReturned = !!(loan.returnDate || loan.returnedDate || loan.deliveryDate)
  const isReturnedStatus = (loan.status ?? '').startsWith('RETURNED')
  return hasReturned || isReturnedStatus
}

async function loadFormSelectOptions() {
  try {
    const [usersRes, booksRes] = await Promise.all([
      api.get<SpringPageResponse<UserNested>>('/users/search', { params: { page: 0, size: 100 } }),
      api.get<SpringPageResponse<BookNested>>('/books/search', { params: { page: 0, size: 100 } })
    ])

    userOptions.value = usersRes.data.content.map(u => ({
      label: u.fullName || u.name || u.email || `ID ${u.id}`,
      value: u.id
    }))

    bookOptions.value = booksRes.data.content.map(b => ({
      label: b.title,
      value: b.id
    }))
  } catch (e) {
    console.error('Erro ao carregar opções', e)
  }
}

async function fetchLoans() {
  loading.value = true
  try {
    const res = await api.get<SpringPageResponse<Loan>>('/loans/search', {
      params: {
        term: searchTerm.value.trim() || undefined,
        page: currentPage.value,
        size: pageSize.value,
        sort: selectedSort.value
      }
    })
    loans.value = res.data.content
    totalElements.value = res.data.totalElements
    totalPages.value = res.data.totalPages
  } catch (e) {
    let msg = 'Erro ao carregar lista de empréstimos.'
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 403) {
        msg = 'Sua sessão expirou ou você não tem permissão de Administrador. Faça login novamente.'
      } else {
        msg = e.response?.data?.message || msg
      }
    }
    $q.notify({ type: 'negative', message: msg })
  } finally {
    loading.value = false
  }
}

function applySort(val: string) {
  selectedSort.value = val
  currentPage.value = 0
  void fetchLoans()
}

function debounceSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 0
    void fetchLoans()
  }, 400)
}

function changePage(p: number) {
  if (p >= 0 && p < totalPages.value) {
    currentPage.value = p
    void fetchLoans()
  }
}

function openCreateDialog() {
  createForm.userId = null
  createForm.bookId = null

  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  createForm.limitTerm = nextWeek.toISOString().split('T')[0] ?? ''

  isCreateDialogOpen.value = true
}

async function handleCreateLoan() {
  if (!createForm.userId || !createForm.bookId || !createForm.limitTerm) {
    $q.notify({ type: 'warning', message: 'Preencha todos os campos obrigatórios!' })
    return
  }

  submitting.value = true
  try {
    await api.post('/loans', {
      userId: createForm.userId,
      bookId: createForm.bookId,
      termLimit: createForm.limitTerm
    })

    $q.notify({ type: 'positive', message: 'Empréstimo realizado com sucesso!' })
    isCreateDialogOpen.value = false
    void fetchLoans()
  } catch (e) {
    const msg = axios.isAxiosError(e) ? e.response?.data?.message : 'Falha ao realizar empréstimo.'
    $q.notify({ type: 'negative', message: msg || 'Falha ao realizar empréstimo.' })
  } finally {
    submitting.value = false
  }
}

function openRenewDialog(loan: Loan) {
  selectedLoanForRenew.value = loan
  renewForm.loanId = loan.id

  const currentLimit = loan.termLimit || loan.limitTerm || loan.dueDate
  if (currentLimit) {
    const d = new Date(currentLimit)
    d.setDate(d.getDate() + 7)
    renewForm.newTerm = d.toISOString().split('T')[0] ?? ''
  } else {
    renewForm.newTerm = ''
  }

  isRenewDialogOpen.value = true
}

async function handleRenewLoan() {
  if (!renewForm.loanId || !renewForm.newTerm) return
  submitting.value = true
  try {
    await api.patch(`/loans/${renewForm.loanId}/renew`, { newTerm: renewForm.newTerm })
    $q.notify({ type: 'positive', message: 'Empréstimo renovado com sucesso!' })
    isRenewDialogOpen.value = false
    void fetchLoans()
  } catch (e) {
    const msg = axios.isAxiosError(e) ? e.response?.data?.message : 'Falha ao renovar.'
    $q.notify({ type: 'negative', message: msg || 'Falha ao renovar.' })
  } finally {
    submitting.value = false
  }
}

function openReturnDialog(loan: Loan) {
  selectedLoanForReturn.value = loan
  isReturnDialogOpen.value = true
}

async function handleReturnLoan() {
  if (!selectedLoanForReturn.value?.id) return
  returning.value = true
  try {
    await api.patch(`/loans/${selectedLoanForReturn.value.id}/return`)
    $q.notify({ type: 'positive', message: 'Livro devolvido com sucesso!' })
    isReturnDialogOpen.value = false
    void fetchLoans()
  } catch (e) {
    const msg = axios.isAxiosError(e) ? e.response?.data?.message : 'Erro ao devolver.'
    $q.notify({ type: 'negative', message: msg || 'Erro ao devolver.' })
  } finally {
    returning.value = false
  }
}

onMounted(() => {
  void loadFormSelectOptions()
  void fetchLoans()
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
  border-radius: 8px;
}

.btn-filter {
  border-color: #B15505 !important;
  color: #B15505 !important;
  border-radius: 8px;
}

.btn-add-loan {
  background-color: #B15505 !important;
  color: #FFFFFF !important;
  border-radius: 8px;
  font-weight: 600;
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

.status-chip {
  padding: 4px 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  display: inline-block;
  min-width: 80px;
}

.status-rented {
  background-color: #D4EDDA !important;
  color: #155724 !important;
}

.status-overdue {
  background-color: #F8D7DA !important;
  color: #721C24 !important;
}

.status-returned-ok {
  background-color: #D4EDDA !important;
  color: #155724 !important;
}

.status-returned-delay {
  background-color: #FFE082 !important;
  color: #6D4C41 !important;
}

.status-default {
  background-color: #E2E3E5 !important;
  color: #383D41 !important;
}

.btn-renew {
  border-color: #B15505 !important;
  color: #B15505 !important;
  border-radius: 6px;
  font-weight: 600;
  padding: 2px 10px;
  font-size: 0.8rem;
}

.action-btn-return {
  border: 1.5px solid #B15505;
  color: #B15505;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  min-height: 28px;
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

.dialog-card {
  width: 460px;
  max-width: 90vw;
  background-color: #FFF3D8;
  border: 1.5px solid #B15505;
  border-radius: 16px;
}

.bg-dialog-header {
  background-color: #F8E3C3;
  border-bottom: 1px solid #E5C396;
}

.modal-input :deep(.q-field__control) {
  background-color: #FFFFFF !important;
  border-color: #D9A066 !important;
  border-radius: 8px !important;
  height: 40px !important;
}

.modal-input :deep(.q-field__native) {
  color: #5C2A02 !important;
  font-weight: 500;
}

.btn-cancel {
  border-color: #B15505 !important;
  color: #B15505 !important;
  border-radius: 8px;
  padding: 4px 16px;
  background-color: #FFF3D8 !important;
}

.btn-save {
  background-color: #B15505 !important;
  color: #FFFFFF !important;
  border-radius: 8px;
  padding: 4px 20px;
  font-weight: 600;
}
</style>