<template>
  <q-layout view="lHh Lpr lFf" class="auth-container">
    <q-page-container>
      <q-page class="auth-container row no-wrap full-height">
        <div class="col-12 col-md-6 auth-banner column flex-center q-pa-lg">
          <q-icon name="menu_book" size="100px" color="amber-1" />
          <h1 class="text-h3 text-weight-bold text-amber-1 q-mt-md q-mb-none text-center">
            BibliotecaBooks
          </h1>
        </div>

        <div class="col-12 col-md-6 auth-form-container column flex-center q-pa-xl">
          <div class="auth-card width-limit">
            <h2 class="text-h4 text-weight-bold text-center auth-title q-mb-xl text-primary-text">
              {{ $t('auth.welcomeBack') }}
            </h2>

            <q-form @submit.prevent="handleLogin" class="q-gutter-y-md">
              <div>
                <label class="text-weight-bold text-caption auth-label block q-mb-xs text-brand-subtle">
                  {{ $t('auth.email') }}
                </label>
                <q-input v-model="form.email" type="email" dense outlined class="custom-input" :placeholder="$t('auth.emailPlaceholder')" lazy-rules :rules="[val => !!val || 'E-mail é obrigatório']"/>
              </div>

              <div>
                <label class="text-weight-bold text-caption auth-label block q-mb-xs text-brand-subtle">
                  {{ $t('auth.password') }}
                </label>
                <q-input v-model="form.password" :type="isPasswordVisible ? 'text' : 'password'" dense outlined class="custom-input" :placeholder="$t('auth.passwordPlaceholder')" lazy-rules :rules="[val => !!val || 'Senha é obrigatória']">
                  <template #append>
                    <q-icon
                      :name="isPasswordVisible ? 'visibility' : 'visibility_off'"
                      class="cursor-pointer"
                      @click="isPasswordVisible = !isPasswordVisible"
                    />
                  </template>
                </q-input>

                <div class="row justify-end q-mt-xs">
                  <router-link to="/forgot-password" class="auth-link text-caption text-primary-text">
                    {{ $t('auth.forgotPassword') }}
                  </router-link>
                </div>
              </div>

              <q-checkbox v-model="form.rememberMe" :label="$t('auth.rememberMe')" class="auth-checkbox" />

              <div class="row q-col-gutter-md q-pt-sm">
                <div class="col-6">
                  <q-btn outline no-caps type="button" text-color="primary-text" color="secundary" class="full-width" :label="$t('auth.clear')" @click="clearForm"/>
                </div>
                <div class="col-6">
                  <q-btn unelevated no-caps type="submit" text-color="secondary-text" color="main-dark" class="full-width text-primary-text" :label="$t('auth.login')" :loading="loading"/>
                </div>
              </div>

              <div class="text-center q-pt-md">
                <span class="text-caption auth-subtext q-mr-xs">{{ $t('auth.noAccount') }}</span>
                <router-link to="/register" class="auth-link text-caption text-weight-bold text-primary-text">
                  {{ $t('auth.signUpHere') }}
                </router-link>
              </div>
            </q-form>
          </div>
        </div>
      </q-page>
   </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LocalStorage, useQuasar } from 'quasar'
import { api } from '../../boot/axios'
import { Permissions } from '../../constants/permissions.constants'
import axios from 'axios'

interface LoginResponse {
  token: string
  role?: string
  user?: Record<string, unknown>
}

const $q = useQuasar()
const router = useRouter()

const isPasswordVisible = ref(false)
const loading = ref(false)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

function clearForm() {
  form.email = ''
  form.password = ''
  form.rememberMe = false
}

onMounted(() => {
  const savedEmail = LocalStorage.getItem<string>('rememberedEmail')
  if(savedEmail){
    form.email = savedEmail
    form.rememberMe = true
  }
})

async function handleLogin() {
  loading.value = true

  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      email: form.email,
      password: form.password
    })

    LocalStorage.set('token', response.data.token)

    if(response.data.role){
      LocalStorage.set('user_role', response.data.role)
    }
    if (response.data.user) {
      LocalStorage.set('user', response.data.user)
    }

    if(form.rememberMe){
      LocalStorage.set('rememberedEmail', form.email)
    }else{
      LocalStorage.remove('rememberedEmail')
    }

    $q.notify({
      type: 'positive',
      message: 'Login realizado com sucesso!'
    })

    if(response.data.role === Permissions.ADMIN){
      void router.replace('/admin/dashboard')
    }else{
      void router.replace('/user/dashboard')
    }

  } catch (error: unknown) {
    let errorMessage = 'Falha na autenticação, verifique suas informações.'

    if(axios.isAxiosError(error)){
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
.auth-container {
  min-height: 100vh;
  background-color: #B15505;
}

.auth-banner {
  background: #B15505;
  color: #FFF3D8;
}

.auth-form-container {
  background-color: #FFF3D8;
}

.width-limit {
  width: 100%;
  max-width: 420px;
}

.auth-link {
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.auth-link:hover {
  text-decoration: underline;
  opacity: 0.85;
}

@media (max-width: 1023px) {
  .auth-banner {
    display: none;
  }
  
  .auth-form-container {
    width: 100%;
  }
}
</style>