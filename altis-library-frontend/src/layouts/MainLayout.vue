<template>
  <q-layout view="hHh rLr fLf">
    <q-header class="header">
      <q-toolbar>
        <q-toolbar-title>
          BibliotecaBooks
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above class="menu" side="left" bordered>
      <q-list>
        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
          </q-item-section>
          <q-item-section class="menu-text">Dashboard</q-item-section>
        </q-item>
          <q-item clickable v-ripple to="/">
          <q-item-section avatar>
          </q-item-section>
          <q-item-section class="menu-text">Empréstimos</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
          </q-item-section>
          <q-item-section class="menu-text">Usuários</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
          </q-item-section>
          <q-item-section class="menu-text">Livros</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
          </q-item-section>
          <q-item-section class="menu-text">Editoras</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="page-container">
      <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer"/>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style lang="css">
  .header{
    background-color: #B15505;
    color: #FFF3D8;
  }
  .menu{
    background-color: #B15505;
    color: white;
  }
  .menu-text{
    color: #FFF3D8;
  }
  .page-container{
    background-color: #FFF3D8;
  }

</style>