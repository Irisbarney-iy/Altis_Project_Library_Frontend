<template>
    <q-header class="app-header">
        <q-toolbar class="q-px-md">
            <q-btn v-if="showToggle" flat dense round icon="menu" aria-label="Menu" class="q-mr-sm" @click="$emit('toggle-drawer')"/>

            <div class="row items-center cursor-pointer" @click="$router.push('/')">
                <q-icon name="book" size="32px" class="q-mr-sm"/>
                <span class="text-h6 text-weight-bold">BibliotecaBooks</span>
            </div>
                <q-space/>

            <div class="row items-center cursor-pointer relative-position">
                <div class="column items-end q-mr-md text-right">
                    <span class="text-weight-bold text-uppercase user-name">LEVY FERNANDES</span>
                    <span class="text-caption user-configurations">{{ $t('header.settings') }}</span>
                </div>
                <q-avatar size="42px" color="amber-2" text-color="brown-10" icon="person" />
                <UserSettingsMenu />
            </div>
        </q-toolbar>
    </q-header>
</template>

<script setup lang="ts">
import UserSettingsMenu from './SettingsMenu.vue'
defineProps({showToggle: {type: Boolean, default: true}})
defineEmits(['toggle-drawer'])
</script>

<style scoped>

.app-header{
    background-color: #B15505;
    color: #FFF3D8;
}

.user-name{
    font-size: 0.85rem;
    letter-spacing: 0.5px;
}

.user-configurations{
    font-size: 0.75rem;
    opacity: 0.8;
}

</style>