<script setup>
import {getArticles} from "@/supabase.js";
import {ref} from "vue";
import {getName} from "@/helpers.js";
import Card from "@/components/Card.vue";
import {store} from "@/store.js";

const publishedArticles = ref([])
const unpublishedArticles = ref([]);
(() => {
  store.setLoading(true);
  getArticles().then(res => {
    const { data } = res;
    Promise.all(data.map(async (article) => {
      const writerName = await getName(article.writer).catch(() => "ERROR");
      const editorName = await getName(article.editor).catch(() => "NONE");
      const newData = {
        ...article,
        writer: writerName,
        editor: editorName,
      }
      if(article.status) {
        publishedArticles.value.push(newData)
      } else {
        unpublishedArticles.value.push(newData);
      }
    }))
  }).finally(() => {
    store.setLoading(false);
  })

})()
</script>

<template>
  <h1>DASHBOARD</h1>
  <div class="article_container">
    <div class="for_edit">
      <h2>For Edit</h2>
      <Card
        v-for="article in unpublishedArticles"
        :key="`${article.id}@${article.title}`"
        :article="article"
      />
    </div>
    <div class="published">
      <h2>Published</h2>
      <Card
        v-for="article in publishedArticles"
        :key="`${article.id}@${article.title}`"
        :article="article"
      />
    </div>
  </div>
</template>

<style scoped>
.article_container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
}
</style>
