<template>
  <q-page class="q-pa-lg bg-main-light">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h5 class="text-h5 text-weight-bold text-primary-text q-my-none">{{ t('profile.title', 'Meu Perfil') }}</h5>
        <div class="text-caption text-secondary-text">{{ t('profile.subtitle', 'Veja e edite seus dados pessoais') }}</div>
      </div>
      <q-btn flat round icon="undo" size="lg" color="primary-text" @click="goBack" />
    </div>

    <q-card flat class="profile-card q-pa-lg">
      <div class="row items-center justify-between q-mb-lg">
        <div class="row items-center q-gutter-md">
          <q-avatar size="64px" class="profile-avatar">
            <q-icon name="person" size="44px" color="white" />
          </q-avatar>
          <div>
            <div class="text-h6 text-weight-bold text-primary-text">{{ user.name || '-' }}</div>
            <div class="text-subtitle2 text-primary-text text-underline">{{ user.email || '-' }}</div>
          </div>
        </div>

        <q-btn outline no-caps icon="edit" class="btn-edit-profile" :label="t('profile.editProfile', 'Editar Perfil')" @click="openEditModal" />
      </div>

      <div class="q-gutter-y-md">
        <div>
          <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('auth.fullName', 'Nome completo') }}</div>
          <div class="text-body1 text-primary-text text-weight-medium">{{ user.name || '-' }}</div>
        </div>

        <div>
          <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('auth.email', 'Email') }}</div>
          <div class="text-body1 text-primary-text text-weight-medium text-underline">{{ user.email || '-' }}</div>
        </div>

        <div>
          <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('auth.cpf', 'CPF') }}</div>
          <div class="text-body1 text-primary-text text-weight-medium">{{ formatCpf(user.cpf) }}</div>
        </div>

        <div>
          <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('auth.phone', 'Telefone') }}</div>
          <div class="text-body1 text-primary-text text-weight-medium">{{ formatPhone(user.phone) }}</div>
        </div>

        <div>
          <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('auth.birthDate', 'Data de Nascimento') }}</div>
          <div class="text-body1 text-primary-text text-weight-medium">{{ formatDate(user.birthDate) }}</div>
        </div>

        <div>
          <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('auth.address', 'Endereço') }}</div>
          <div class="text-body1 text-primary-text text-weight-medium">{{ user.address || '-' }}</div>
        </div>
      </div>
    </q-card>

    <q-dialog v-model="isEditDialogOpen" persistent>
      <q-card class="dialog-card">
        <q-card-section class="row items-center justify-between bg-dialog-header q-px-lg q-py-md">
          <div class="text-h6 text-weight-bold text-primary-text">{{ t('profile.editProfile', 'Editar Perfil') }}</div>
          <q-btn icon="close" flat round dense v-close-popup color="primary-text" />
        </q-card-section>

        <q-card-section class="q-px-lg q-py-md">
          <q-form @submit="handleSave" class="q-gutter-y-sm">
            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('auth.fullName', 'Nome completo') }}</div>
              <q-input v-model="form.name" outlined dense hide-bottom-space class="modal-input" :rules="[val => !!val || t('auth.validation.nameRequired', 'Nome é obrigatório!'), val => (val && val.length >= 3 && val.length <= 100) || t('auth.validation.nameLength', 'O nome deve ter entre 3 e 100 caracteres!')]" />
            </div>

            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('auth.email', 'Email') }}</div>
              <q-input v-model="form.email" outlined dense hide-bottom-space class="modal-input" :rules="[val => !!val || t('auth.validation.emailRequired', 'E-mail é obrigatório!'), val => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(val) || t('auth.validation.emailPattern', 'O e-mail deve ser @gmail.com!')]" />
            </div>

            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('auth.cpf', 'CPF') }}</div>
              <q-input :model-value="formatCpf(user.cpf)" outlined dense disable hide-bottom-space class="modal-input input-disabled" />
            </div>

            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('auth.phone', 'Telefone') }}</div>
              <q-input v-model="form.phone" outlined dense hide-bottom-space unmasked-value mask="(##) #####-####" placeholder="(85) 99737-7275" class="modal-input" :rules="[val => !val || val.length >= 10 || t('auth.validation.phoneInvalid', 'O telefone deve conter DDD e número válidos!')]" />
            </div>

            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('auth.birthDate', 'Data de Nascimento') }}</div>
              <q-input :model-value="formatDate(user.birthDate)" outlined dense disable hide-bottom-space class="modal-input input-disabled" />
            </div>

            <div>
              <div class="text-caption text-weight-bold text-primary-text q-mb-xs">{{ t('auth.address', 'Endereço') }}</div>
              <q-input v-model="form.address" outlined dense hide-bottom-space class="modal-input" :rules="[val => !val || val.length <= 255 || t('auth.validation.addressMax', 'O endereço não pode ter mais que 255 caracteres!')]" />
            </div>

            <div class="row justify-end q-gutter-sm q-pt-md">
              <q-btn outline no-caps class="btn-cancel" :label="t('common.cancel', 'Cancelar')" v-close-popup />
              <q-btn unelevated no-caps type="submit" class="btn-save" :label="t('common.save', 'Salvar')" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { api } from '../../boot/axios'
import axios from 'axios'

interface UserProfile {
  id?: number
  name?: string
  fullName?: string
  email?: string
  cpf?: string
  phone?: string
  birthDate?: string | null
  address?: string
}

const { t } = useI18n()
const router = useRouter()
const $q = useQuasar()

const loading = ref(false)
const saving = ref(false)
const isEditDialogOpen = ref(false)

const user = ref<UserProfile>({})
const form = reactive({
  name: '',
  email: '',
  phone: '',
  address: ''
})

function goBack() {
  void router.push('/user/dashboard')
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

function formatCpf(cpfRaw?: string): string {
  if (!cpfRaw) return '---'
  const digits = cpfRaw.replace(/\D/g, '')
  if (digits.length !== 11) return cpfRaw
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function formatPhone(phoneRaw?: string): string {
  if (!phoneRaw) return '-'
  const digits = phoneRaw.replace(/\D/g, '')
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phoneRaw
}

async function fetchUserProfile() {
  loading.value = true
  try {
    const res = await api.get<UserProfile>('/users/me')
    const data = res.data
    user.value = {
      ...data,
      name: data.name || data.fullName || ''
    }
  } catch (e) {
    let msg = 'Erro ao carregar dados do perfil.'
    if (axios.isAxiosError(e)) {
      msg = e.response?.data?.message || msg
    }
    $q.notify({ type: 'negative', message: msg })
  } finally {
    loading.value = false
  }
}

function openEditModal() {
  form.name = user.value.name || ''
  form.email = user.value.email || ''
  form.phone = user.value.phone ? user.value.phone.replace(/\D/g, '') : ''
  form.address = user.value.address || ''
  isEditDialogOpen.value = true
}

async function handleSave() {
  saving.value = true
  try {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone ? form.phone.replace(/\D/g, '') : undefined,
      address: form.address.trim() || undefined
    }

    await api.patch('/users/me', payload)

    $q.notify({ type: 'positive', message: 'Perfil atualizado com sucesso!' })
    isEditDialogOpen.value = false
    void fetchUserProfile()
  } catch (e) {
    let msg = 'Falha ao atualizar perfil.'
    if (axios.isAxiosError(e)) {
      msg = e.response?.data?.message || msg
    }
    $q.notify({ type: 'negative', message: msg })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  void fetchUserProfile()
})
</script>

<style scoped>
.bg-main-light {
  background-color: #FFF3D8;
}

.text-primary-text {
  color: #5C2A02;
}

.text-secondary-text {
  color: #B15505;
}

.text-underline {
  text-decoration: underline;
}

.profile-card {
  background-color: #FFF3D8;
  border: 1.5px solid #B15505;
  border-radius: 16px;
}

.profile-avatar {
  background-color: #D9A066;
}

.btn-edit-profile {
  border-color: #B15505 !important;
  color: #B15505 !important;
  border-radius: 8px;
  font-weight: 600;
  background-color: #FFF3D8 !important;
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

.input-disabled :deep(.q-field__control) {
  background-color: #F8E3C3 !important;
  opacity: 0.8;
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