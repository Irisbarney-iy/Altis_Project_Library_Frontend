<template>
  <div class="column no-wrap full-height auth-container" style="min-height: 100vh;">
    <div class="col-auto bg-main-dark auth-top-banner flex flex-center q-py-lg text-white">
      <div class="text-center">
        <q-icon name="menu_book" size="80px" color="amber-1" />
        <h4 class="text-weight-bold q-mt-xs text-amber-1">BibliotecaBooks</h4>
      </div>
    </div>

    <div class="col flex flex-center bg-main-light q-pa-md">
      <div style="width: 100%; max-width: 420px;">
        <h5 class="text-center text-weight-bold text-primary-text q-mb-lg">
          {{ t('auth.recoverPasswordTitle') }}
        </h5>

        <q-form @submit.prevent="handleValidateData" class="q-gutter-y-md">
          <div>
            <label class="text-caption text-weight-medium text-primary-text block q-mb-xs">
              {{ t('auth.email') }}
            </label>
            <q-input v-model="form.email" :placeholder="t('auth.emailPlaceholder')" outlined dense lazy-rules
              :rules="[
                val => !!val || t('auth.validation.emailRequired'),
                val => isValidGmail(val) || t('auth.validation.emailPattern')
              ]"/>
          </div>

          <div>
            <label class="text-caption text-weight-medium text-primary-text block q-mb-xs">
              {{ t('auth.cpf') }}
            </label>
            <q-input v-model="form.cpf" placeholder="___.___.___-__" mask="###.###.###-##" outlined dense lazy-rules
              :rules="[
                val => !!val || t('auth.validation.cpfRequired'),
                val => isValidCPF(val) || t('auth.validation.cpfInvalid')
              ]"/>
          </div>

          <div class="row q-col-gutter-sm q-mt-lg">
            <div class="col-6">
              <q-btn outline no-caps class="full-width btn-cancel" :label="t('auth.cancel')" to="/login"/>
            </div>
            <div class="col-6">
              <q-btn unelevated no-caps type="submit" color="main-dark" class="full-width text-white" :label="t('auth.validateData')" :loading="loading"/>
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { api } from '../../boot/axios'
import { unmaskDigits, isValidGmail, isValidCPF } from '../../utils/utils'
import axios from 'axios'

const { t } = useI18n()
const $q = useQuasar()
const router = useRouter()

const loading = ref(false)

const form = reactive({
  email: '',
  cpf: ''
})

async function handleValidateData() {
  loading.value = true

  try {
    const cleanCpf = unmaskDigits(form.cpf)

    const payload = {
      email: form.email,
      cpf: cleanCpf
    }

    const response = await api.post<{ recoveryToken?: string; token?: string }>('/auth/recover-password/validate', payload)
    
    const token = response.data.recoveryToken || response.data.token

    $q.notify({
      type: 'positive',
      message: 'Dados validados com sucesso!'
    })

    void router.push({
      path: '/auth/recover-password/reset',
      query: { token, email: form.email }
    })
  } catch (error: unknown) {
    let errorMessage = 'Dados não encontrados ou inválidos.'

    if (axios.isAxiosError(error)) {
      errorMessage = error?.response?.data?.message || errorMessage
    }

    $q.notify({
      type: 'negative',
      message: errorMessage
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-top-banner {
  background-color: #B15505;
}

.btn-cancel {
  border-color: #8C4304 !important;
  color: #8C4304 !important;
}
</style>