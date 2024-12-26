<script setup>
import {ref} from "vue";
import {RouterLink} from "vue-router";

const props = defineProps(['userData'])
const isEditor = ref(props.userData.type === "EDITOR");
</script>

<template>
  <nav>
    <div class="nav-links">
      <RouterLink class="link" to="/dashboard">Dashboard</RouterLink>
      <RouterLink class="link" to="/dashboard/allmedia">All Media</RouterLink>
      <RouterLink class="link" to="/dashboard/accounts" v-if="isEditor">Accounts</RouterLink>
    </div>
    <RouterLink class="link" to="/">Logout</RouterLink>
  </nav>
</template>

<style>
nav {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
