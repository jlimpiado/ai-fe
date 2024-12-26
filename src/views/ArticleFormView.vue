<script setup>
import {getSessionData} from "@/helpers.js";
import {onMounted, ref} from "vue";
import Editor from '@tinymce/tinymce-vue';
import {store} from "@/store.js";
import {
  deleteImg,
  getArticle,
  getCompanies,
  getImg,
  insertArticles,
  updateArticle,
  uploadImg
} from "@/supabase.js";
import {useRouter} from "vue-router";

const router = useRouter();
const {action, id} = defineProps({
  action: String,
  id: {type: String, required: false}
})
const companies = ref(null);

(() => {
  store.setLoading(true);
  Promise.all([
    getCompanies().then(res => {
      const {data} = res;
      companies.value = data;
    })
  ]).finally(() => {
    store.setLoading(false);
  })
})()

const TINY_KEY = import.meta.env.VITE_TINY_KEY;
const userData = getSessionData();

const company_name = ref('');
const imgInput = ref({
  old: null,
  new: null,
});
const title = ref('');
const link = ref('');
const dateInput = ref('');
const content = ref('');
const isPublished = ref(false);
const writerRef = ref(null);

const tempImgSrc = ref('');

onMounted(() => {
  if(id) {
    getArticle(id).then(res => {
      const {data} = res;
      // console.log(data)
      company_name.value = data.company;
      imgInput.value.new = data.image_url;
      tempImgSrc.value = data.image_url;
      title.value = data.title;
      link.value = data.link;
      dateInput.value = data.date;
      content.value = data.content;
      writerRef.value = data.writer;
      isPublished.value = data.status;
    })
  }
})

const handleImageInput = (event) => {
  const file = event.target.files[0];
  if(file) {
    const old = imgInput.value.new instanceof File ? null : imgInput.value.new;
    imgInput.value = {
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

const handleActionArticle = async (data) => {
  if(action === 'edit') {
    return updateArticle(+id, data);
  }
  return insertArticles(data);
}

const handleImg = async () => {
  if(typeof imgInput.value.new === 'string') {
    return imgInput.value.new;
  }
  return uploadImg(imgInput.value.new);
}

const submitFunction = async (toggle) => {
  store.toggleLoading();
  const resImg = await handleImg(imgInput.value.new);

  if(resImg?.error) {
    alert(resImg.error);
    return
  }

  const toBeInserted = {
    title: title.value,
    link: link.value,
    date: dateInput.value,
    content: content.value,
    company: company_name.value,
    writer: writerRef.value ? writerRef.value : userData.id,
    status: toggle !== undefined ? !isPublished.value: isPublished.value
  }

  if(typeof resImg !== 'string') {
    toBeInserted['image_url'] = await getImg(resImg.data.path);
  }

  if(userData.type === 'EDITOR') {
    toBeInserted['editor'] = userData.id;
  }

  const {data: _, error} = await handleActionArticle(toBeInserted);

  if(error){
    await deleteImg(resImg.data.path);
    alert(error.message);
    store.toggleLoading();
    return;
  }

  if(action === 'edit' && imgInput.value.old) {
    await deleteImg(imgInput.value.old);
  }

  store.toggleLoading();
  await router.push('/dashboard/allmedia')
}

</script>
<template>
  <h1>{{action.toUpperCase()}} ARTICLE</h1>
  <form class="form_container" @submit.prevent="() => submitFunction()">
    <div class="form_group">
      <label for="company">Select Company:</label>
      <select v-if="companies" v-model="company_name" name="company" id="company" required>
        <option value="">Select a company</option>
        <option v-for="company in companies" :value="company.id" :key="company.name+company.id">
          {{company.name}}
        </option>
      </select>
    </div>
    <div class="form_group">
      <label for="image_upload">Image: </label>
      <div class="form_img_group">
        <img
          v-if="tempImgSrc"
          :src="tempImgSrc"
          :alt="title"
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
      <label for="title">Title:</label>
      <input type="text" required name="title" id="title" v-model="title" />
    </div>
    <div class="form_group">
      <label for="link">Link:</label>
      <input type="url" name="link" required pattern="https?://.*" id="link" v-model="link"/>
    </div>
    <div class="form_group">
      <label for="date">Date:</label>
      <input type="date" v-model="dateInput" required name="date" id="date"/>
    </div>
    <div>
      <label for="content">Content:</label>
      <Editor
        v-model="content"
        v-if="TINY_KEY"
        :ref="content"
        :api-key="TINY_KEY"
        :init="{
          selector: 'textarea',
          plugins: 'list link table code help word count',
        }"
      />
      <p v-else>NEED TinyMCE KEY</p>
    </div>
    <div class="button_group">
      <button type="submit">SUBMIT</button>
      <button
        type="button"
        v-if="userData.type === 'EDITOR'"
        @click="() => submitFunction(true)"
      >
        SUBMIT AND {{isPublished ? "UNPUBLISH" : "PUBLISH"}}
      </button>
    </div>
  </form>
</template>
<style scoped>
</style>
