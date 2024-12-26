<script setup>
import {RouterLink, useRouter} from 'vue-router';
import {getArticles} from "@/supabase.js";
import {ref} from "vue";
import {store} from "@/store.js";
import {getName, getSessionData} from "@/helpers.js";

const articlesArr = ref([]);
const router = useRouter();

(() => {
  store.setLoading(true);
  getArticles().then((res) => {
    const {data} = res;
    processArticles(data)
  })
})();

const userData = getSessionData();

const processArticles = async (articles) => {
  articlesArr.value = await Promise.all(articles.map(async article => {
    const writerName = await getName(article.writer).catch(() => "ERROR");
    const editorName = article.editor ? await getName(article.editor).catch(() => "ERROR") : "NONE";
    const status = article.status ? "PUBLISHED" : "FOR EDIT"
    return {
      ...article,
      writer: writerName,
      editor: editorName,
    status
    }
  }));
  store.setLoading(false);
}

</script>
<template>
  <div class="header">
    <h1>Articles</h1>
    <router-link
      v-if="userData.type === 'WRITER'"
      class="link"
      :to="{name:'article-form', params:{action: 'create'}}"
    >
      ADD ARTICLE
    </router-link>
  </div>
  <table>
    <thead>
    <tr>
      <td>Actions</td>
      <td>Image</td>
      <td>Title</td>
      <td>Link</td>
      <td>Writer</td>
      <td>Editor</td>
      <td>Status</td>
    </tr>
    </thead>
    <tbody>
    <tr v-for="article in articlesArr" :key="`${article.id}-${article.title}`">
      <td>
        <button
          @click="() => router.push({name: 'article-form', params: {action: 'edit', id: article.id}})"
        >
          EDIT
        </button>
      </td>
      <td>
        <img :src="article.image_url" :alt="article.title">
      </td>
      <td>{{article.title}}</td>
      <td><a :href="article.link">{{article.link}}</a></td>
      <td>{{article.writer}}</td>
      <td>{{article.editor}}</td>
      <td>{{article.status}}</td>
    </tr>
    </tbody>
  </table>
</template>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

img {
  display: block;
  width: 100px;
  height: auto;
}
</style>
