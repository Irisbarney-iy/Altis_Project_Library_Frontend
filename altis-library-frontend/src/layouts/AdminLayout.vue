<template>
  <q-layout view="hHh Lpr fFf">
    <AppHeader @toggle-drawer="toggleLeftDrawer"/>

    <q-drawer
      v-model="leftDrawerOpen" show-if-above bordered :width="220" style="background-color: #B15505;">
      <SideMenu/>
    </q-drawer>

    <q-page-container class="main-container">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import SideMenu from '../components/SideMenu.vue'

const leftDrawerOpen = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>

.main-container{
    background-color: #FFF3D8;
    min-height: 100vh;
}

</style>