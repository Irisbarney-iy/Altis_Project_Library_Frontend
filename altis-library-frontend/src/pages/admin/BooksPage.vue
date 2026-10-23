<template>
  <q-page class="q-pa-lg bg-main-light">
    <div class="row items-center q-mb-lg">
      <h5 class="text-h5 text-weight-bold text-primary-text q-my-none">
        {{ t('books.title', 'LIVROS') }}
      </h5>
    </div>

    <div class="row items-center justify-between q-mb-md gap-md">
      <div class="col-12 col-sm-6 col-md-4">
        <q-input v-model="searchTerm" outlined dense class="bg-white custom-search-input" :placeholder="t('books.searchPlaceholder', 'Buscar livros...')" @update:model-value="debounceSearch">
          <template #prepend>
            <q-icon name="search" color="grey-7" />
          </template>
        </q-input>
      </div>

      <div class="row items-center q-gutter-sm">

        <q-btn outline no-caps icon="tune" color="primary-text" class="btn-filter bg-white" :label="t('common.filter', 'Filtrar')">
          <q-menu auto-close anchor="bottom right" self="top right" class="filter-menu-popup">
            <div class="filter-menu-box">
              <div
                class="filter-option" :class="{ 'filter-option-active': selectedSort === 'title,asc' }" @click="applySort('title,asc')">
                A - Z
              </div>
              <div class="filter-option" :class="{ 'filter-option-active': selectedSort === 'title,desc' }" @click="applySort('title,desc')">
                Z - A
              </div>
              <div class="filter-option" :class="{ 'filter-option-active': selectedSort === 'id,desc' }" @click="applySort('id,desc')">
                {{ t('common.mostRecent', 'Mais Recente') }}
              </div>
            </div>
          </q-menu>
        </q-btn>

        <q-btn unelevated no-caps icon="add" class="btn-add-book" :label="t('books.newBook', 'Novo Livro')" @click="openCreateDialog"/>
      </div>
    </div>

    <div class="table-container rounded-borders overflow-hidden">
      <q-markup-table flat borderless class="custom-table">
        <thead>
          <tr>
            <th class="text-left">{{ t('books.bookTitle', 'Título') }}</th>
            <th class="text-left">{{ t('books.author', 'Autor') }}</th>
            <th class="text-left">{{ t('books.launchYear', 'Lançamento') }}</th>
            <th class="text-left">{{ t('books.total', 'Total') }}</th>
            <th class="text-left">{{ t('books.inUse', 'Em uso') }}</th>
            <th class="text-left">{{ t('books.publisher', 'Editora') }}</th>
            <th class="text-center">{{ t('books.actions', 'Ações') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="text-center q-pa-lg">
              <q-spinner color="main-dark" size="2em" />
            </td>
          </tr>

          <tr v-else-if="books.length === 0">
            <td colspan="7" class="text-center text-grey-7 q-pa-lg">
              {{ t('books.noBooksFound', 'Nenhum livro encontrado.') }}
            </td>
          </tr>

          <tr v-for="book in books" :key="book.id" class="table-row">
            <td class="text-left text-weight-medium text-primary-text">
              {{ book.title }}
            </td>
            <td class="text-left text-primary-text">
              {{ book.author || '-' }}
            </td>
            <td class="text-left text-primary-text">
              {{ getYearDisplay(book) }}
            </td>
            <td class="text-left text-primary-text">
              {{ getTotalQuantity(book) }}
            </td>
            <td class="text-left text-primary-text">
              {{ getInUseQuantity(book) }}
            </td>
            <td class="text-left text-primary-text">
              {{ getPublisherDisplay(book) }}
            </td>
            <td class="text-center">
              <div class="row justify-center items-center q-gutter-xs">
                <q-btn flat dense icon="edit" class="action-btn" @click="openEditDialog(book)"/>
                <q-btn flat dense icon="delete_outline" class="action-btn" @click="openDeleteDialog(book)"/>
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
            }, `Mostrando de ${paginationInfo.from} a ${paginationInfo.to} de ${paginationInfo.total} livros`)
          }}
        </div>

        <div class="row items-center q-gutter-xs">
          <q-btn outline dense icon="chevron_left" class="page-btn" :disable="currentPage === 0" @click="changePage(currentPage - 1)"/>

          <q-btn
            v-for="page in totalPages" :key="page"unelevated dense class="page-number-btn" :class="{ 'page-btn-active': page - 1 === currentPage }" :label="page" @click="changePage(page - 1)"/>

          <q-btn outline dense icon="chevron_right" class="page-btn" :disable="currentPage >= totalPages - 1" @click="changePage(currentPage + 1)"/>
        </div>
      </div>
    </div>

    <q-dialog v-model="isDialogOpen" persistent>
      <q-card class="dialog-card">
        <q-card-section class="row items-center justify-between bg-dialog-header q-px-lg q-py-md">
          <div class="text-h6 text-weight-bold text-primary-text">
            {{ isEditing ? t('books.dialog.editTitle', 'Editar Livro') : t('books.dialog.createTitle', 'Novo Livro') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup color="primary-text" />
        </q-card-section>

        <q-card-section class="q-px-lg q-py-md">
          <q-form ref="formRef" @submit="handleSaveBook" class="q-gutter-y-sm">
            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">
                {{ t('books.bookTitle', 'Título') }}
              </div>
              <q-input v-model="form.title" outlined dense hide-bottom-space class="modal-input" :rules="[val => (!!val && val.trim() !== '') || t('books.dialog.titleRequired', 'O título é obrigatório!')]"/>
            </div>

            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">
                {{ t('books.author', 'Autor') }}
              </div>
              <q-input v-model="form.author" outlined dense hide-bottom-space class="modal-input" :rules="[val => (!!val && val.trim() !== '') || t('books.dialog.authorRequired', 'O autor é obrigatório!')]"/>
            </div>

            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">
                {{ t('books.launchYear', 'Lançamento') }}
              </div>
              <q-input v-model.number="form.releaseYear" outlined dense type="number" hide-bottom-space placeholder="Ex: 1999" class="modal-input" :rules="[val => (val !== null && val !== undefined && val !== '') || t('books.dialog.releaseYearRequired', 'A data de lançamento é obrigatória!')]"/>
            </div>

            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">
                {{ t('books.total', 'Quantidade Total') }}
              </div>
              <q-input v-model.number="form.totalQuantity" outlined dense type="number" hide-bottom-space class="modal-input" :rules="[val => (val !== null && val !== undefined && val >= 0) || t('books.dialog.quantityRequired', 'A quantidade total é obrigatória!')]"/>
            </div>

            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">
                {{ t('books.publisher', 'Editora') }}
              </div>
              <q-select v-model="form.publisherId" outlined dense emit-value map-options hide-bottom-space :options="publisherOptions" class="modal-input" :rules="[val => !!val || t('books.dialog.publisherRequired', 'A editora é obrigatória!')]"/>
            </div>

            <div class="row justify-end q-gutter-sm q-pt-md">
              <q-btn
                outline no-caps class="btn-cancel" :label="t('common.cancel', 'Cancelar')" v-close-popup/>
              <q-btn unelevated no-caps type="submit" :label="t('common.save', 'Salvar')" class="btn-save" :loading="submitting"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isDeleteDialogOpen" persistent>
      <q-card class="dialog-card">
        <q-card-section class="row items-center justify-between bg-dialog-header">
          <div class="text-h6 text-weight-bold text-primary-text">
            {{ t('books.dialog.deleteConfirmTitle', 'Confirmar Exclusão') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup color="primary-text" />
        </q-card-section>

        <q-card-section class="q-pa-md text-body1 text-primary-text">
          {{ t('books.dialog.deleteConfirmMessage', { title: bookToDelete?.title || '' }, `Tem certeza que deseja excluir o livro "${bookToDelete?.title}"?`) }}
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md q-px-md">
          <q-btn
            outline no-caps class="btn-cancel" :label="t('common.cancel', 'Cancelar')" v-close-popup/>
          <q-btn
            unelevated no-caps color="negative" :label="t('common.confirm', 'Confirmar')" :loading="deleting" @click="handleDeleteBook"/>
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

interface PublisherNested {
  id: number
  name: string
}

interface Book {
  id?: number | undefined
  title: string
  author: string
  releaseYear?: number | string | null | undefined
  totalQuantity?: number | null | undefined
  total?: number | null | undefined
  inUseQuantity?: number | null | undefined
  inUse?: number | null | undefined
  publisherId?: number | null | undefined
  publisherName?: string | null | undefined
  publisher?: PublisherNested | string | null | undefined
}

interface BookForm {
  id: number | undefined
  title: string
  author: string
  releaseYear: number | null | undefined
  totalQuantity: number | null | undefined
  publisherId: number | null | undefined
}

interface SelectOption {
  label: string
  value: number
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

const books = ref<Book[]>([])
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const searchTerm = ref('')
const selectedSort = ref('title,asc')
const currentPage = ref(0)
const pageSize = ref(9)
const totalElements = ref(0)
const totalPages = ref(0)

const publisherOptions = ref<SelectOption[]>([])

const isDialogOpen = ref(false)
const isEditing = ref(false)
const form = reactive<BookForm>({
  id: undefined,
  title: '',
  author: '',
  releaseYear: null,
  totalQuantity: null,
  publisherId: null
})

const isDeleteDialogOpen = ref(false)
const bookToDelete = ref<Book | null>(null)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const paginationInfo = computed(() => {
  if (totalElements.value === 0) return { from: 0, to: 0, total: 0 }
  const from = currentPage.value * pageSize.value + 1
  const to = Math.min((currentPage.value + 1) * pageSize.value, totalElements.value)
  return { from, to, total: totalElements.value }
})

function getYearDisplay(book: Book): string {
  return book.releaseYear ? String(book.releaseYear) : '-'
}

function getTotalQuantity(book: Book): string | number {
  return book.totalQuantity ?? book.total ?? 0
}

function getInUseQuantity(book: Book): string | number {
  return book.inUseQuantity ?? book.inUse ?? 0
}

function getPublisherDisplay(book: Book): string {
  if (typeof book.publisher === 'object' && book.publisher !== null) {
    return book.publisher.name
  }
  if (typeof book.publisher === 'string') {
    return book.publisher
  }
  return book.publisherName || '-'
}

async function loadPublisherOptions() {
  try {
    const response = await api.get<SpringPageResponse<PublisherNested>>('/publishers/search', {
      params: { page: 0, size: 100, sort: 'name,asc' }
    })
    publisherOptions.value = response.data.content.map(p => ({
      label: p.name,
      value: p.id
    }))
  } catch (error) {
    console.error('Falha ao carregar editoras', error)
  }
}

async function fetchBooks() {
  loading.value = true

  try {
    const response = await api.get<SpringPageResponse<Book>>('/books/search', {
      params: {
        term: searchTerm.value.trim() || undefined,
        page: currentPage.value,
        size: pageSize.value,
        sort: selectedSort.value
      }
    })

    books.value = response.data.content
    totalElements.value = response.data.totalElements
    totalPages.value = response.data.totalPages
  } catch (error: unknown) {
    let message = 'Erro ao carregar lista de livros.'
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
  void fetchBooks()
}

function debounceSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 0
    void fetchBooks()
  }, 400)
}

function changePage(page: number) {
  if (page < 0 || page >= totalPages.value) return
  currentPage.value = page
  void fetchBooks()
}

function openCreateDialog() {
  isEditing.value = false
  form.id = undefined
  form.title = ''
  form.author = ''
  form.releaseYear = null
  form.totalQuantity = null
  form.publisherId = null
  isDialogOpen.value = true
}

function openEditDialog(book: Book) {
  isEditing.value = true
  form.id = book.id
  form.title = book.title
  form.author = book.author || ''
  form.releaseYear = book.releaseYear ? Number(book.releaseYear) : null
  form.totalQuantity = book.totalQuantity !== null && book.totalQuantity !== undefined ? Number(book.totalQuantity) : null

  if (typeof book.publisher === 'object' && book.publisher !== null) {
    form.publisherId = book.publisher.id
  } else {
    form.publisherId = book.publisherId ?? null
  }

  isDialogOpen.value = true
}

async function handleSaveBook() {
  submitting.value = true

  try {
    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      releaseYear: form.releaseYear,
      totalQuantity: form.totalQuantity,
      publisherId: form.publisherId
    }

    if (isEditing.value && form.id) {
      await api.patch(`/books/${form.id}`, payload)
      $q.notify({ type: 'positive', message: 'Livro atualizado com sucesso!' })
    } else {
      await api.post('/books', payload)
      $q.notify({ type: 'positive', message: 'Livro cadastrado com sucesso!' })
    }

    isDialogOpen.value = false
    void fetchBooks()
  } catch (error: unknown) {
    let message = 'Falha ao salvar livro.'
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message
    }
    $q.notify({ type: 'negative', message })
  } finally {
    submitting.value = false
  }
}

function openDeleteDialog(book: Book) {
  bookToDelete.value = book
  isDeleteDialogOpen.value = true
}

async function handleDeleteBook() {
  if (!bookToDelete.value?.id) return
  deleting.value = true

  try {
    await api.delete(`/books/${bookToDelete.value.id}`)
    $q.notify({ type: 'positive', message: 'Livro excluído com sucesso!' })
    isDeleteDialogOpen.value = false
    void fetchBooks()
  } catch (error: unknown) {
    let message = 'Erro ao excluir livro.'
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message
    }
    $q.notify({ type: 'negative', message })
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  void loadPublisherOptions()
  void fetchBooks()
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

.btn-add-book {
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