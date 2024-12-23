<script lang="ts" setup>
import { NCard } from 'naive-ui';
import Author from './author/Author.vue';
import Annotation from './annotation/Annotation.vue';
import Synopsis from './synopsis/Synopsis.vue';
</script>

<template>
  <NCard>
    <h1>Book</h1>
    <Author />
    <Annotation />
    <Synopsis />
  </NCard>
</template>

<style scoped></style>
