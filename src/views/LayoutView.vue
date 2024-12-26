<script setup>
import Nav from "@/components/Nav.vue";
import {getSessionData} from "@/helpers.js";
import {RouterView} from "vue-router";
const userData = getSessionData();

</script>
<template>
  <main class="main">
    <Nav :userData="userData" />
    <div class="content-container">
      <RouterView />
    </div>
  </main>
</template>
<style>
.main {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 200px 1fr;
}

.content-container {
  max-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
