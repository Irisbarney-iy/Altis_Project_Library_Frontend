<template>
  <div class="row no-wrap full-height auth-container" style="min-height: 100vh;">
    <div class="col-12 col-md-6 flex flex-center bg-main-light q-pa-md overflow-auto">
      <div style="width: 100%; max-width: 440px;" class="q-py-sm">
        <h4 class="text-center text-weight-bold text-primary-text q-mb-sm">
          {{ t('auth.welcome') }}
        </h4>

        <q-form @submit.prevent="handleRegister" class="q-gutter-y-xs">
          <div>
            <label class="text-caption text-weight-medium text-primary-text">{{ t('auth.fullName') }}</label>
            <q-input v-model="form.name" :placeholder="t('auth.fullNamePlaceholder')" outlined dense :rules="[val => !!val || t('auth.validation.nameRequired'), val => !!val || t('auth.validation.nameRequired'),
            val => (val && val.length >= 3 && val.length <= 100) || t('auth.validation.nameLength')]" lazy-rules/>
          </div>

          <div>
            <label class="text-caption text-weight-medium text-primary-text">{{ t('auth.email') }}</label>
            <q-input v-model="form.email" :placeholder="t('auth.emailPlaceholder')" outlined dense :rules="[
                val => !!val || t('auth.validation.emailRequired'),
                val => isValidGmail(val) || t('auth.validation.emailPattern')
              ]" lazy-rules
              />
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <label class="text-caption text-weight-medium text-primary-text">{{ t('auth.cpf') }}</label>
              <q-input v-model="form.cpf" placeholder="___.___.___-__" mask="###.###.###-##" outlined dense :rules="
              [
                val => !!val || t('auth.validation.cpfRequired'),
                val => isValidCPF(val) || t('auth.validation.cpfInvalid')
              ]" 
              lazy-rules/>
            </div>

            <div class="col-12 col-sm-6">
              <label class="text-caption text-weight-medium text-primary-text">{{ t('auth.phone') }}</label>
              <q-input v-model="form.phone" placeholder="(85) 9____-____" mask="(##) #####-####" unmasked-value outlined dense
                :rules="[
                  val => !!val || t('auth.validation.phoneRequired'),
                  val => (val && val.length >= 8 && val.length <= 20) || t('auth.validation.phoneInvalid')
                ]" lazy-rules/>
            </div>
          </div>

          <div>
            <label class="text-caption text-weight-medium text-primary-text">{{ t('auth.birthDate') }}</label>
            <q-input v-model="form.birthDate" placeholder="__/__/____" mask="##/##/####" outlined dense :rules="[
                val => !!val || t('auth.validation.birthDateRequired'),
                val => isPastDate(val) || t('auth.validation.pastDate'),
                val => isMinimumAge(val, 6) || t('auth.validation.minAge')
              ]" lazy-rules="ondemand">

              <template #append>
                <q-icon name="event" class="cursor-pointer text-primary-text">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.birthDate" mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="OK" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div>
            <label class="text-caption text-weight-medium text-primary-text">{{ t('auth.address') }}</label>
            <q-input v-model="form.address" :placeholder="t('auth.addressPlaceholder')" outlined dense :rules="[
                val => !!val || t('auth.validation.addressRequired'),
                val => val.length <= 255 || t('auth.validation.addressMax')
              ]" lazy-rules="ondemand"/>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <label class="text-caption text-weight-medium text-primary-text">{{ t('auth.password') }}</label>
              <q-input v-model="form.password" :placeholder="t('auth.passwordPlaceholder')" :type="isPasswordVisible ? 'text' : 'password'" outlined dense :rules="[
                  val => !!val || t('auth.validation.passwordRequired'),
                  val => isValidPassword(val) || t('auth.validation.passwordRules')
                ]" lazy-rules="ondemand">

                <template #append>
                  <q-icon :name="isPasswordVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer text-primary-text" @click="isPasswordVisible = !isPasswordVisible"/>
                </template>
              </q-input>
            </div>

            <div class="col-12 col-sm-6">
              <label class="text-caption text-weight-medium text-primary-text">{{ t('auth.confirmPassword') }}</label>
              <q-input v-model="form.confirmPassword" :placeholder="t('auth.confirmPasswordPlaceholder')" :type="isConfirmPasswordVisible ? 'text' : 'password'" outlined dense :rules="[
                  val => !!val || t('auth.validation.confirmPasswordRequired'),
                  val => val === form.password || t('auth.validation.passwordMatch')
                ]" lazy-rules="ondemand">
                <template #append>
                  <q-icon :name="isConfirmPasswordVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer text-primary-text" @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"/>
                </template>
              </q-input>
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mt-sm">
            <div class="col-6">
              <q-btn outline no-caps class="full-width btn-limpar" :label="t('auth.clear')" @click="clearForm"/>
            </div>
            <div class="col-6">
              <q-btn
                unelevated no-caps type="submit" color="main-dark" class="full-width text-white" :label="t('auth.register')" :loading="loading"/>
            </div>
          </div>

          <div class="text-center q-mt-sm">
            <span class="text-caption auth-subtext q-mr-xs">{{ t('auth.hasAccount') }} </span>
            <router-link to="/login" class="text-caption text-primary-text text-weight-bold" style="text-decoration: underline;">
              {{ t('auth.loginHere') }}
            </router-link>
          </div>
        </q-form>
      </div>
    </div>

    <div class="col-12 col-md-6 bg-main-dark gt-sm flex flex-center text-white">
      <div class="text-center">
        <q-icon name="menu_book" size="130px" color="amber-1" />
        <h1 class="text-h3 text-weight-bold text-amber-1 q-mt-md q-mb-none text-center">BibliotecaBooks</h1>
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
import axios from 'axios'
import { formatDateToISO, isValidGmail, isValidPassword, isValidCPF, isPastDate, isMinimumAge } from '../../utils/utils'

const { t } = useI18n()
const $q = useQuasar()
const router = useRouter()

const loading = ref(false)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const form = reactive({
  name: '',
  email: '',
  cpf: '',
  phone: '',
  birthDate: '',
  address: '',
  password: '',
  confirmPassword: ''
})

function clearForm() {
  form.name = ''
  form.email = ''
  form.cpf = ''
  form.phone = ''
  form.birthDate = ''
  form.address = ''
  form.password = ''
  form.confirmPassword = ''
}

async function handleRegister() {
  loading.value = true

  try {
    const formattedBirthDate = formatDateToISO(form.birthDate)

    const payload = {
      name: form.name,
      email: form.email,
      cpf: form.cpf,
      phone: form.phone,
      birthDate: formattedBirthDate,
      address: form.address,
      password: form.password
    }

    await api.post('/users', payload)

    $q.notify({
      type: 'positive',
      message: t('auth.notifications.registerSuccess')
    })

    void router.push('/login')
  } catch (error: unknown) {
    let errorMessage = t('auth.notifications.registerError')

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
.btn-limpar {
  border-color: #8C4304 !important;
  color: #8C4304 !important;
}
</style>