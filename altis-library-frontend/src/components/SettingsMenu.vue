<template>
    <q-menu auto-close anchor="bottom right" self="top right" class="setting-dropdown">
        <q-list class="settings-list q-py-xs">
            <q-item v-if="userRole === Permissions.ADMIN" clickable v-ripple @click="navigateTo('/admin/preferences')"
                class="settings-item">
                <q-item-section class="text-center text-weight-medium">
                    {{ $t('header.preferences') }}
                </q-item-section>
            </q-item>

            <q-item v-if="userRole === Permissions.USER" clickable v-ripple @click="navigateTo('/user/profile')"
                class="settings-item">
                <q-item-section class="text-center text-weight-medium">
                    {{ $t('header.viewProfile') }}
                </q-item-section>
            </q-item>

            <q-item clickable class="settings-item">
                <q-item-section class="text-center text-weight-medium">
                    {{ $t('header.language') }}
                </q-item-section>

                <q-menu anchor="top end" self="top start">
                    <q-list style="min-width: 100px">
                        <q-item clickable v-close-popup @click="changeLanguage('pt-BR')">
                            <q-item-section>Português</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="changeLanguage('en-US')">
                            <q-item-section>English</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="changeLanguage('es')">
                            <q-item-section>Español</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-item>

            <q-item clickable v-ripple @click="handleLogout" class="settings-item">
                <q-item-section class="text-center text-weight-medium">
                    {{ $t('header.logout') }}
                </q-item-section>
            </q-item>
        </q-list>
    </q-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Permissions } from '../constants/permissions.constants'

const router = useRouter()
const { locale } = useI18n()

const userRole = computed(() => localStorage.getItem('user_role') || Permissions.USER)

function changeLanguage(lang: string) {
    locale.value = lang
    localStorage.setItem('user_language', lang)
}

function navigateTo(path: string) {
    void router.push(path)
}

function handleLogout() {
    localStorage.removeItem('user_role')
    void router.push('/login')
}
</script>

<style scoped>
.settings-list {
  background-color: #B15505;
  color: #FFF3D8;
  min-width: 160px;
}

.settings-item {
  border-radius: 8px;
  margin: 2px 4px;
}

.settings-item:hover {
  background-color: rgba(255, 243, 216, 0.15);
}
</style>