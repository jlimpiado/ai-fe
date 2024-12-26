<script setup>
import {onMounted, ref} from "vue";
import {store} from "@/store.js";
import {addUser, deleteUser, getUser, updateUser} from "@/supabase.js";
import {useRouter} from "vue-router";

const router = useRouter();

const {action, id} = defineProps({
  action: String,
  id: {type: String, required: false},
})

const firstName = ref('');
const lastName = ref('');
const userType = ref('WRITER');
const userStatus = ref(true);
const userName = ref('');
const userPassword = ref('');

onMounted(() => {
  if(id) {
    store.setLoading(true);
    getUser(+id).then(res => {
      const {data} = res;
      firstName.value = data.first_name;
      lastName.value = data.last_name;
      userType.value = data.type;
      userStatus.value = data.status;
      userName.value = data.username;
      userPassword.value = data.password;
    }).finally(() => {
      store.setLoading(false);
    })
  }
})

const handleActionUser = async (data) => {
  if(action === 'edit') {
    return updateUser(+id, data);
  }

  return addUser(data);
}

const submitFunction = async (toggleDelete) => {
  store.setLoading(true);

  if(toggleDelete) {
    const {data: _, error} = await deleteUser(+id);

    if(error) {
      store.setLoading(false);
      alert(error.message);
      return;
    }

    await router.push('/dashboard/accounts')
    return;
  }

  const data = {
    first_name: firstName.value,
    last_name: lastName.value,
    type: userType.value,
    status: userStatus.value,
    username: userName.value,
    password: userPassword.value,
  }

  const {data:_, error} = await handleActionUser(data);

  if(error)  {
    store.setLoading(false);
    alert(error.message);
    return;
  }

  await router.push('/dashboard/accounts');
}

</script>
<template>
  <h1>{{action.toUpperCase()}} USER</h1>
  <form class="form_container" @submit.prevent="() => submitFunction()">
    <div class="form_group">
      <label for="firstname">First Name:</label>
      <input type="text" v-model="firstName" name="firstname" id="firstname" required />
    </div>
    <div class="form_group">
      <label for="lastname">Last Name:</label>
      <input type="text" v-model="lastName" name="lastname" id="lastname" required />
    </div>
    <div class="form_group">
      <label for="lastname">User type:</label>
      <select name="type" id="type" v-model="userType">
        <option value="WRITER">WRITER</option>
        <option value="EDITOR">EDITOR</option>
      </select>
    </div>
    <div class="form_group col_group">
      <label for="status">Active:</label>
      <input type="checkbox" name="status" id="status" v-model="userStatus" />
    </div>
    <div class="form_group">
      <label for="username">Username:</label>
      <input type="text" name="username" id="username" required v-model="userName" />
    </div>
    <div class="form_group">
      <label for="password">Password:</label>
      <input type="password" name="password" id="password" required v-model="userPassword" />
    </div>
    <div class="button_group">
      <button type="submit">SUBMIT</button>
      <button v-if="action === 'edit'" @click="() => submitFunction(true)">DELETE</button>
    </div>
  </form>
</template>
