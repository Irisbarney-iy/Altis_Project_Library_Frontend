<template>
  <q-layout view="hHh Lpr fFf">
    <AppHeader :show-toggle="false"/>
    <q-page-container class="main-container">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'
</script>

<style scoped>

.main-container{
    background-color: #FFF3D8;
    min-height: 100vh;
}

</style>