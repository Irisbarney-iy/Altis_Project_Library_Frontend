<template>
    <q-header class="app-header">
        <q-toolbar class="q-px-md">
            <q-btn v-if="showToggle" flat dense round icon="menu" aria-label="Menu" class="q-mr-sm" @click="$emit('toggle-drawer')"/>

            <div class="row items-center cursor-pointer" @click="$router.push('/')">
                <q-icon name="book" size="32px" class="q-mr-sm"/>
                <span class="text-h6 text-weight-bold">BibliotecaBooks</span>
            </div>
                <q-space/>

                <div class="row items-center">
                    <div class="column items-end q-mr-md text-right">
                        <span class="text-weight-bold text-uppercase label-name">TESTE DE NOME</span>
                        <span class="text-caption label-sub">configurações</span>
                    </div>
                    <q-avatar size="42px" color="brown-14" text-color="amber-2" icon="person"/>
                </div>
        </q-toolbar>
    </q-header>
</template>

<script setup lang="ts">
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