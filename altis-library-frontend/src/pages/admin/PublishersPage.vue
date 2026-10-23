<template>
  <q-page class="q-pa-lg bg-main-light">
    <div class="row items-center q-mb-lg">
      <h5 class="text-h5 text-weight-bold text-primary-text q-my-none">
        {{ t('publishers.title', 'EDITORAS') }}
      </h5>
    </div>

    <div class="row items-center justify-between q-mb-md gap-md">
      <div class="col-12 col-sm-6 col-md-4">
        <q-input v-model="searchTerm" outlined dense class="bg-white custom-search-input" :placeholder="t('publishers.searchPlaceholder', 'Buscar editoras...')" @update:model-value="debounceSearch">
          <template #prepend>
            <q-icon name="search" color="grey-7" />
          </template>
        </q-input>
      </div>

      <div class="row items-center q-gutter-sm">
        <q-btn outline no-caps icon="tune" color="primary-text" class="btn-filter bg-white" :label="t('common.filter', 'Filtrar')">
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

        <q-btn unelevated no-caps icon="add" class="btn-add-publisher" :label="t('publishers.newPublisher', 'Nova Editora')" @click="openCreateDialog"/>
      </div>
    </div>

    <div class="table-container rounded-borders overflow-hidden">
      <q-markup-table flat borderless class="custom-table">
        <thead>
          <tr>
            <th class="text-left">{{ t('publishers.name', 'Nome da Editora') }}</th>
            <th class="text-left">{{ t('publishers.email', 'E-mail') }}</th>
            <th class="text-left">{{ t('publishers.phone', 'Telefone') }}</th>
            <th class="text-left">{{ t('publishers.site', 'Site') }}</th>
            <th class="text-center">{{ t('publishers.actions', 'Ações') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="text-center q-pa-lg">
              <q-spinner color="main-dark" size="2em" />
            </td>
          </tr>

          <tr v-else-if="publishers.length === 0">
            <td colspan="5" class="text-center text-grey-7 q-pa-lg">
              {{ t('publishers.noPublishersFound', 'Nenhuma editora encontrada.') }}
            </td>
          </tr>

          <tr v-for="pub in publishers" :key="pub.id" class="table-row">
            <td class="text-left text-weight-medium text-primary-text">
              {{ pub.name }}
            </td>
            <td class="text-left text-primary-text">
              {{ pub.email || '-' }}
            </td>
            <td class="text-left text-primary-text">
              {{ pub.phone || '-' }}
            </td>
            <td class="text-left text-primary-text">
              {{ pub.site || pub.website || '-' }}
            </td>

            <td class="text-center">
              <div class="row justify-center items-center q-gutter-xs">
                <q-btn flat dense icon="edit" class="action-btn" @click="openEditDialog(pub)"/>
                <q-btn flat dense icon="delete_outline" class="action-btn" @click="openDeleteDialog(pub)"/>
              </div>
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
            }, `Mostrando de ${paginationInfo.from} a ${paginationInfo.to} de ${paginationInfo.total} editoras`)
          }}
        </div>

        <div class="row items-center q-gutter-xs">
          <q-btn outline dense icon="chevron_left" class="page-btn" :disable="currentPage === 0" @click="changePage(currentPage - 1)"/>

          <q-btn
            v-for="page in totalPages" :key="page" unelevated dense class="page-number-btn" :class="{ 'page-btn-active': page - 1 === currentPage }" :label="page" @click="changePage(page - 1)"/>

          <q-btn outline dense icon="chevron_right" class="page-btn" :disable="currentPage >= totalPages - 1" @click="changePage(currentPage + 1)"/>
        </div>
      </div>
    </div>

    <q-dialog v-model="isDialogOpen" persistent>
    <q-card class="dialog-card">
        <q-card-section class="row items-center justify-between bg-dialog-header q-px-lg q-py-md">
        <div class="text-h6 text-weight-bold text-primary-text">
            {{ isEditing ? t('publishers.dialog.editTitle') : t('publishers.dialog.createTitle') }}
        </div>
        <q-btn icon="close" flat round dense v-close-popup color="primary-text" />
        </q-card-section>

        <q-card-section class="q-px-lg q-py-md">
        <q-form ref="formRef" @submit="handleSavePublisher" class="q-gutter-y-md">
            <div>
            <div class="text-caption text-weight-bold text-primary-text q-mb-xs">
                {{ t('publishers.name') }}
            </div>
            <q-input v-model="form.name" outlined dense hide-bottom-space class="modal-input" :rules="[val => (!!val && val.trim() !== '') || t('publishers.dialog.nameRequired')]"/>
            </div>

            <div>
            <div class="text-caption text-weight-bold text-primary-text q-mb-xs">
                {{ t('publishers.email') }}
            </div>
            <q-input
                v-model="form.email" outlined dense hide-bottom-space type="email" class="modal-input"/>
            </div>

            <div>
            <div class="text-caption text-weight-bold text-primary-text q-mb-xs">
                {{ t('publishers.phone') }}
            </div>
            <q-input v-model="form.phone" outlined dense hide-bottom-space mask="(##) #####-####" unmasked-value class="modal-input"/>
            </div>

            <div>
            <div class="text-caption text-weight-bold text-primary-text q-mb-xs">
                {{ t('publishers.site') }}
            </div>
            <q-input v-model="form.site" outlined dense hide-bottom-space placeholder="www.editora.com.br" class="modal-input"/>
            </div>

            <div class="row justify-end q-gutter-sm q-pt-md">
            <q-btn
                outline no-caps class="btn-cancel" :label="t('common.cancel')" v-close-popup/>
            <q-btn
                unelevated no-caps type="submit" :label="t('common.save')" class="btn-save" :loading="submitting"/>
            </div>
        </q-form>
        </q-card-section>
    </q-card>
    </q-dialog>

    <q-dialog v-model="isDeleteDialogOpen" persistent>
      <q-card class="dialog-card">
        <q-card-section class="row items-center justify-between bg-dialog-header">
          <div class="text-h6 text-weight-bold text-primary-text">
            {{ t('publishers.dialog.deleteConfirmTitle', 'Confirmar Exclusão') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup color="primary-text" />
        </q-card-section>

        <q-card-section class="q-pa-md text-body1 text-primary-text">
          {{ t('publishers.dialog.deleteConfirmMessage', { name: publisherToDelete?.name || '' }, `Tem certeza que deseja excluir a editora "${publisherToDelete?.name}"?`) }}
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md q-px-md">
          <q-btn
            outline no-caps :label="t('publishers.dialog.cancel', 'Cancelar')" color="primary-text" v-close-popup/>
          <q-btn
            unelevated no-caps color="negative" :label="t('publishers.dialog.confirm', 'Confirmar')" :loading="deleting" @click="handleDeletePublisher"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useQuasar, QForm } from 'quasar'
import { useI18n } from 'vue-i18n'
import { api } from '../../boot/axios'
import axios from 'axios'

interface Publisher {
  id?: number | undefined
  name: string
  email?: string | null | undefined
  phone?: string | null | undefined
  site?: string | null | undefined
  website?: string | null | undefined
}

interface PublisherForm {
  id: number | undefined
  name: string
  email: string
  phone: string
  site: string
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
const formRef = ref<QForm | null>(null)

const publishers = ref<Publisher[]>([])
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const searchTerm = ref('')
const selectedSort = ref('name,asc')
const currentPage = ref(0)
const pageSize = ref(9)
const totalElements = ref(0)
const totalPages = ref(0)

const isDialogOpen = ref(false)
const isEditing = ref(false)
const form = reactive<PublisherForm>({
  id: undefined,
  name: '',
  email: '',
  phone: '',
  site: ''
})

const isDeleteDialogOpen = ref(false)
const publisherToDelete = ref<Publisher | null>(null)

let searchTimeout: ReturnType<typeof setTimeout> | null = null
    
const paginationInfo = computed(() => {
  if (totalElements.value === 0) return { from: 0, to: 0, total: 0 }
  const from = currentPage.value * pageSize.value + 1
  const to = Math.min((currentPage.value + 1) * pageSize.value, totalElements.value)
  return { from, to, total: totalElements.value }
})

async function fetchPublishers() {
  loading.value = true

  try {
    const response = await api.get<SpringPageResponse<Publisher>>('/publishers/search', {
      params: {
        term: searchTerm.value.trim() || undefined,
        page: currentPage.value,
        size: pageSize.value,
        sort: selectedSort.value
      }
    })

    publishers.value = response.data.content
    totalElements.value = response.data.totalElements
    totalPages.value = response.data.totalPages
  } catch (error: unknown) {
    let message = 'Erro ao carregar lista de editoras.'
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
  void fetchPublishers()
}

function debounceSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 0
    void fetchPublishers()
  }, 400)
}

function changePage(page: number) {
  if (page < 0 || page >= totalPages.value) return
  currentPage.value = page
  void fetchPublishers()
}

function openCreateDialog() {
  isEditing.value = false
  form.id = undefined
  form.name = ''
  form.email = ''
  form.phone = ''
  form.site = ''
  isDialogOpen.value = true
}

function openEditDialog(publisher: Publisher) {
  isEditing.value = true
  form.id = publisher.id
  form.name = publisher.name
  form.email = publisher.email || ''
  form.phone = publisher.phone || ''
  form.site = publisher.site || publisher.website || ''
  isDialogOpen.value = true
}

async function handleSavePublisher() {
  submitting.value = true

  try {
    const payload = {
      name: form.name.trim(),
      email: form.email?.trim() || null,
      phone: form.phone?.trim() || null,
      site: form.site?.trim() || null
    }

    if (isEditing.value && form.id) {
      await api.patch(`/publishers/${form.id}`, payload)
      $q.notify({ type: 'positive', message: 'Editora atualizada com sucesso!' })
    } else {
      await api.post('/publishers', payload)
      $q.notify({ type: 'positive', message: 'Editora criada com sucesso!' })
    }

    isDialogOpen.value = false
    void fetchPublishers()
  } catch (error: unknown) {
    let message = 'Falha ao salvar editora.'
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message
    }
    $q.notify({ type: 'negative', message })
  } finally {
    submitting.value = false
  }
}

function openDeleteDialog(publisher: Publisher) {
  publisherToDelete.value = publisher
  isDeleteDialogOpen.value = true
}

async function handleDeletePublisher() {
  if (!publisherToDelete.value?.id) return
  deleting.value = true

  try {
    await api.delete(`/publishers/${publisherToDelete.value.id}`)
    $q.notify({ type: 'positive', message: 'Editora excluída com sucesso!' })
    isDeleteDialogOpen.value = false
    void fetchPublishers()
  } catch (error: unknown) {
    let message = 'Erro ao excluir editora.'
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message
    }
    $q.notify({ type: 'negative', message })
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  void fetchPublishers()
})
</script>

<style scoped>
.bg-main-light {
  background-color: #FFF3D8;
}

.text-primary-text {
  color: #5C2A02;
}

.custom-search-input :deep(.q-field__control),
.custom-input :deep(.q-field__control) {
  border-color: #D9A066;
  border-radius: 8px;
}

.btn-filter {
  border-color: #B15505 !important;
  color: #B15505 !important;
  border-radius: 8px;
}

.btn-add-publisher {
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

.action-btn {
  border: 1.5px solid #B15505;
  color: #B15505;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  min-height: 32px;
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