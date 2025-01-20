<script setup lang="ts">
import {ref} from "vue";
import {supabase} from "@/supabase";
import {useRouter} from "vue-router";
import {setSessionData} from "@/helpers";
import {store} from "@/store";

const router = useRouter()

const username = ref('');
const password = ref('');
const errMessage = ref('');
const isConnectionOnline = ref(true);

const checkConnection = async () => {
  try {
    const {_, error} = await supabase.from('users').select().single();

    if(error) {
      console.error(error);
      isConnectionOnline.value = false;
      return;
    }
    console.log("Supabase is online.")
  } catch (error) {
    console.error(error)
    isConnectionOnline.value = false;
  }
}

checkConnection();


const login = async () => {
  store.toggleLoading();
  errMessage.value = '';

  try {
    const {data: {password: _, ...userData}, error: userError} = await supabase
      .from('users')
      .select('id, username, password, type, status')
      .eq('username', username.value)
      .eq('password', password.value)
      .eq('status', true)
      .single();

    if (userError) {
      errMessage.value = 'User not found.';
      return;
    }

    setSessionData(userData);
    await router.push('/dashboard')

  } catch (err) {
    console.error('Error during login:', err);
    errMessage.value = 'An unexpected error occurred.';
  }
  store.toggleLoading();
}
</script>

<template>
  <main>
    <div :class="isConnectionOnline ? 'close' : 'open'" class="modal">
      <h1>SUPABASE IS OFFLINE</h1>
      <p>Contact developer to restore it.</p>
    </div>
    <h1 class="title">LOGIN</h1>
    <div class="container">
      <form class="form_container" @submit.prevent="login">
        <input class="form_input" v-model="username" type="text" id="username" placeholder="Username" required />
        <input class="form_input" type="password" v-model="password" id="password" placeholder="Password" required />
        <button type="submit">LOGIN</button>
      </form>
      <p v-if="errMessage" class="error">{{ errMessage }}</p>
    </div>
  </main>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #222;
}

.open {
  display: flex;
}

.close {
  display: none;
}
.title {
  display: grid;
  place-items: center;
}
.form_container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.form_input {
  outline: none;
  padding: 1rem;
  background: none;
  color: var(--color-text);
  border: 1px solid #FFF;
  border-radius: 10px;
}

main {
  display: flex;
  gap: 5rem;
  align-items: center;
}

h1 {
  font-size: 3rem;
}

button[type="submit"] {
  cursor: pointer;
  height: 3rem;
  border-radius: 10px;
}
</style>
