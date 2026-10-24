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
          {{ t('auth.changePasswordTitle') }}
        </h5>

        <q-form @submit.prevent="handleChangePassword" class="q-gutter-y-md">
          <div>
            <label class="text-caption text-weight-medium text-primary-text block q-mb-xs">
              {{ t('auth.newPassword') }}
            </label>
            <q-input v-model="form.newPassword" :placeholder="t('auth.passwordPlaceholder')" :type="isPasswordVisible ? 'text' : 'password'" outlined dense lazy-rules
              :rules="[
                val => !!val || t('auth.validation.passwordRequired'),
                val => isValidPassword(val) || t('auth.validation.passwordRules')
              ]">
              <template #append>
                <q-icon :name="isPasswordVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer text-primary-text" @click="isPasswordVisible = !isPasswordVisible"/>
              </template>
            </q-input>
          </div>

          <div>
            <label class="text-caption text-weight-medium text-primary-text block q-mb-xs">
              {{ t('auth.confirmPassword') }}
            </label>
            <q-input v-model="form.confirmPassword" :placeholder="t('auth.confirmPasswordPlaceholder')" :type="isConfirmPasswordVisible ? 'text' : 'password'" outlined dense lazy-rules
              :rules="[
                val => !!val || t('auth.validation.confirmPasswordRequired'),
                val => val === form.newPassword || t('auth.validation.passwordMatch')
              ]">
              <template #append>
                <q-icon :name="isConfirmPasswordVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer text-primary-text" @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"/>
              </template>
            </q-input>
          </div>

          <div class="row q-col-gutter-sm q-mt-lg">
            <div class="col-6">
              <q-btn outline no-caps class="full-width btn-cancelar" :label="t('auth.cancel')" to="/login"/>
            </div>
            <div class="col-6">
              <q-btn unelevated no-caps type="submit" color="main-dark" class="full-width text-white" :label="t('auth.saveChanges')" :loading="loading"/>
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { api } from '../../boot/axios'
import { isValidPassword } from '../../utils/utils'
import axios from 'axios'

const { t } = useI18n()
const $q = useQuasar()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const form = reactive({
  newPassword: '',
  confirmPassword: ''
})

async function handleChangePassword() {
  loading.value = true

  try {
    const tokenParam = (route.query.token as string) || ''

    const payload = {
      recoveryToken: tokenParam,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword
    }

    await api.post('/auth/recover-password/reset', payload)

    $q.notify({
      type: 'positive',
      message: 'Senha alterada com sucesso! Faça login com a nova senha.'
    })

    void router.push('/login')
  } catch (error: unknown) {
    let errorMessage = 'Falha ao alterar a senha. Tente novamente.'

    if (axios.isAxiosError(error)) {
      const responseData = error?.response?.data

      if (responseData?.fieldErrors && Array.isArray(responseData.fieldErrors) && responseData.fieldErrors.length > 0) {
        errorMessage = responseData.fieldErrors[0].message
      } else if (responseData?.message) {
        errorMessage = responseData.message
      }
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

.btn-cancelar {
  border-color: #8C4304 !important;
  color: #8C4304 !important;
}
</style>