<template>
    <q-list padding class="menu-list">
        <q-item v-for="item in menuItems" :key="item.title" clickable v-ripple :to="item.link" active-class="active-menu-item" class="menu-item q-my-xs">
            <q-item-section>
                <q-item-label class="text-weight-bold text-uppercase">{{ $t(item.title) }}
            </q-item-label>
            </q-item-section>
        </q-item>
    </q-list>
</template>

<script setup lang="ts">
import { Permissions } from '../constants/permissions.constants'

interface MenuItem{
    title: string
    link: string
    permissions: string[]
}

const menuItems: MenuItem[] = [
    { title: 'Dashboard', link: '/admin/dashboard', permissions: [Permissions.ADMIN] },
    { title: 'Empréstimos', link: '/admin/loans', permissions: [Permissions.ADMIN] },
    { title: 'Usuários', link: '/admin/users', permissions: [Permissions.ADMIN] },
    { title: 'Livros', link: '/admin/books', permissions: [Permissions.ADMIN] },
    { title: 'Editoras', link: '/admin/publishers', permissions: [Permissions.ADMIN] }
]

</script>

<style scoped>

.menu-list{
    background-color: #B15505;
    height: 100%;
}

.menu-item{
    color: #FFF3D8;
    border-radius: 4px;
}

.active-menu-item{
    background-color: #FFF3D8 !important;
    color: #B15505 !important;
}

</style>