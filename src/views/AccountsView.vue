<script setup>
import {ref} from "vue";
import {getCompanies, getUsers} from "@/supabase.js";
import {store} from "@/store.js";
import {useRouter} from "vue-router";

const router = useRouter();
const users = ref([]);
const companies = ref([]);

(() => {
  store.setLoading(true);
  Promise.all([
    getUsers().then(res => {
      const {data} = res;
      users.value = data;
    }),
    getCompanies().then(res => {
      const {data} = res;
      companies.value = data;
    })])
    .finally(() => {
      store.setLoading(false);
    })
})()
</script>
<template>
  <h1>ACCOUNTS</h1>
  <div class="container">
    <header>
      <h2>USERS</h2>
      <button
        @click="() => {
          router.push({
            name: 'user-form',
            params: {
              action: 'create',
            }
          })
        }"
      >
        ADD USER
      </button>
    </header>
    <table>
      <thead>
      <tr>
        <td>Actions</td>
        <td>First Name</td>
        <td>Last Name</td>
        <td>Type</td>
        <td>Status</td>
        <td>Username</td>
        <td>Password</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="`${user.id}@${user.username}`">
        <td>
          <button @click="router.push({
            name: 'user-form',
            params: {
              action: 'edit',
              id: user.id,
            }
          })">EDIT</button>
        </td>
        <td>{{user.first_name}}</td>
        <td>{{user.last_name}}</td>
        <td>{{user.type}}</td>
        <td>{{user.status ? "ACTIVE" : "INACTIVE"}}</td>
        <td>{{user.username}}</td>
        <td>{{user.password}}</td>
      </tr>
      </tbody>
    </table>
  </div>
  <div class="container">
    <header>
      <h2>COMPANY</h2>
      <button
        @click="() => {
          router.push({
            name: 'company-form',
            params: {
              action: 'create',
            }
          })
        }"
      >
        ADD COMPANY
      </button>
    </header>

    <table>
      <thead>
      <tr>
        <td>Actions</td>
        <td>Logo</td>
        <td>Name</td>
        <td>Status</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="company in companies" :key="`${company.id}@${company.name}`">
        <td>
          <button @click="router.push({
            name: 'company-form',
            params: {
              action: 'edit',
              id: company.id,
            }
          })">EDIT</button>
        </td>

        <td>
          <img
            :src="company.logo"
            :alt="company.name"
            width="100"
          />
        </td>
        <td>{{company.name}}</td>
        <td>{{company.status ? "ACTIVE": "INACTIVE"}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<style>

header {
  display: flex;
  justify-content: space-between;
}

.container {
  margin: 2rem 0;
  border: 1px solid var(--color-text);
  border-radius: 5px;
  padding: 1rem;
}
</style>
