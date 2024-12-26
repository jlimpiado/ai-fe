
<script setup>
import {onMounted, ref} from "vue";
import {store} from "@/store.js";
import {addCompany, deleteCompany, getCompany, getImg, updateCompany, uploadImg} from "@/supabase.js";
import {useRouter} from "vue-router";

const router = useRouter();

const {action, id} = defineProps({
  action: String,
  id: {type: String, required: false},
})

const logoInput = ref({
  old: null,
  new: null,
});
const companyName = ref('');
const status = ref(true);

const tempImgSrc = ref('')

onMounted(() => {
  if(id) {
    store.setLoading(true);
    getCompany(+id).then(res => {
      const {data} = res;
      logoInput.value.new = data.logo;
      tempImgSrc.value = data.logo;
      companyName.value = data.name;
      status.value = data.status;
    }).finally(() => {
      store.setLoading(false);
    })
  }
})

const handleImg = async () => {
  if(typeof logoInput.value.new === 'string') {
    return logoInput.value.new;
  }
  return uploadImg(logoInput.value.new);
}

const handleImageInput = (event) => {
  const file = event.target.files[0];
  if(file) {
    const old = logoInput.value.new instanceof File ? null : logoInput.value.new;
    logoInput.value = {
      old,
      new: file
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      tempImgSrc.value = evt.target.result;
    }
    reader.readAsDataURL(file);
  }
}

const handleActionUser = async (data) => {
  if(action === 'edit') {
    return updateCompany(+id, data);
  }

  return addCompany(data);
}

const submitFunction = async (toggleDelete) => {
  store.setLoading(true);

  if(toggleDelete) {
    const {data: _, error} = await deleteCompany(+id);

    if(error) {
      store.setLoading(false);
      alert(error.message);
      return;
    }

    await router.push('/dashboard/accounts')
    return;
  }

  const resImg = await handleImg(logoInput.value.new);

  if(resImg?.error) {
    alert(resImg.error);
    return
  }

  const data = {
    name: companyName.value,
    status: status.value,
  }

  if(typeof resImg !== 'string') {
    data['logo'] = await getImg(resImg.data.path);
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
  <h1>{{action.toUpperCase()}} COMPANY</h1>
  <form class="form_container" @submit.prevent="() => submitFunction()">
    <div class="form_group">
      <label for="image_upload">Logo: </label>
      <div class="form_img_group">
        <img
          v-if="tempImgSrc"
          :src="tempImgSrc"
          :alt="companyName"
          width="100"
        />
        <input
          :required="!tempImgSrc"
          @change="handleImageInput"
          type="file"
          name="image_upload"
          id="image_upload"
          accept="image/png, image/jpeg, image/jpg">
      </div>
    </div>
    <div class="form_group">
      <label for="lastname">Name:</label>
      <input type="text" v-model="companyName" name="lastname" id="lastname" required />
    </div>
    <div class="form_group col_group">
      <label for="status">Active:</label>
      <input type="checkbox" name="status" id="status" v-model="status" />
    </div>
    <div class="button_group">
      <button type="submit">SUBMIT</button>
      <button v-if="action === 'edit'" @click="() => submitFunction(true)">DELETE</button>
    </div>
  </form>
</template>
