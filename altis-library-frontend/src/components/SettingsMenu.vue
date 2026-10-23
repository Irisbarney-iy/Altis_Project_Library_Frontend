<template>
  <q-menu v-close-popup anchor="bottom right" self="top right" class="setting-dropdown">
    <q-list class="settings-list q-py-xs">
      <q-item v-if="isUserArea" clickable v-ripple @click="navigateTo('/user/profile')" class="settings-item">
        <q-item-section class="text-center text-weight-medium">
          {{ $t('header.viewProfile', 'Visualizar Perfil') }}
        </q-item-section>
      </q-item>

      <q-item clickable class="settings-item">
        <q-item-section class="text-center text-weight-medium">
          {{ $t('header.language', 'Idioma') }}
        </q-item-section>

        <q-menu anchor="top end" self="top start">
          <q-list class="settings-list style-min">
            <q-item clickable v-close-popup @click="changeLanguage('pt-BR')" class="settings-item">
              <q-item-section>Português</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage('en-US')" class="settings-item">
              <q-item-section>English</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage('es')" class="settings-item">
              <q-item-section>Español</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>

      <q-item clickable v-ripple @click="handleLogout" class="settings-item">
        <q-item-section class="text-center text-weight-medium">
          {{ $t('header.logout', 'Sair') }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()

const isUserArea = computed(() => {
  if (route.path.startsWith('/user')) {
    return true
  }

  const storedRole = (
    localStorage.getItem('user_role') ||
    localStorage.getItem('role') ||
    localStorage.getItem('userRole') ||
    ''
  ).toUpperCase()

  const normalized = storedRole.replace('ROLE_', '')
  return normalized === 'USER' || normalized === 'LOCATARIO'
})

function changeLanguage(lang: string) {
  locale.value = lang
  localStorage.setItem('user_language', lang)
}

function navigateTo(path: string) {
  void router.push(path)
}

function handleLogout() {
  localStorage.removeItem('user_role')
  localStorage.removeItem('role')
  localStorage.removeItem('token')
  void router.push('/login')
}
</script>

<style scoped>
.settings-list {
  background-color: #B15505;
  color: #FFF3D8;
  min-width: 160px;
}

.style-min {
  min-width: 120px;
}

.settings-item {
  border-radius: 8px;
  margin: 2px 4px;
}

.settings-item:hover {
  background-color: rgba(255, 243, 216, 0.2);
}
</style>