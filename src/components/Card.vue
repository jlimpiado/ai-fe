<script setup>
defineProps({
  article: Object
})
</script>
<template>
  <div class="card">
    <div class="image_container">
      <img :src="article.image_url" :alt="article.title">
    </div>
    <div class="content">
      <h1>{{article.title}}</h1>
      <p>date: <strong>{{article.date}}</strong></p>
      <p>link: <a :href="article.link" target="_blank"><strong>{{article.link}}</strong></a></p>
      <p>writer: <strong>{{article.writer}}</strong></p>
      <p>editor: <strong>{{article.editor}}</strong></p>
    </div>
  </div>
</template>
<style>
.card {
  display: grid;
  grid-template-columns: 200px 1fr;
  margin: 1rem 0;
}

.image_container {
  width: 100%;
  height: 100%;
}

.image_container img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  margin: 0 2rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
}
</style>
