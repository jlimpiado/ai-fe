<script setup>
import { RouterView } from 'vue-router'
import Loading from "@/components/Loading.vue";
import {store} from "@/store.js";
</script>

<template>
  <RouterView />
  <Teleport to="body">
    <Loading v-if="store.isLoading" />
  </Teleport>
</template>

<style scoped>
</style>
