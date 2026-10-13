<template>
    <q-list padding class="menu-list">
        <q-item v-for="item in menuItems" :key="item.titleKey" clickable v-ripple :to="item.link" active-class="active-menu-item" class="menu-item q-my-xs">
            <q-item-section>
                <q-item-label class="text-weight-bold text-uppercase">{{ $t(item.titleKey) }}
            </q-item-label>
            </q-item-section>
        </q-item>
    </q-list>
</template>

<script setup lang="ts">
import { Permissions } from '../constants/permissions.constants'

interface MenuItem{
    titleKey: string
    link: string
    permissions: string[]
}

const menuItems: MenuItem[] = [
    { titleKey: 'menu.dashboard', link: '/admin/dashboard', permissions: [Permissions.ADMIN] },
    { titleKey: 'menu.loans', link: '/admin/loans', permissions: [Permissions.ADMIN] },
    { titleKey: 'menu.users', link: '/admin/users', permissions: [Permissions.ADMIN] },
    { titleKey: 'menu.books', link: '/admin/books', permissions: [Permissions.ADMIN] },
    { titleKey: 'menu.publishers', link: '/admin/publishers', permissions: [Permissions.ADMIN] }
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