<template>
  <div class="h-full flex flex-col p-4 gap-4">
    <Breadcrumb :items="['仪表盘']" />
    <Banner />
  </div>
</template>

<script lang="ts" setup>
  import Banner from './components/banner.vue';
</script>

<script lang="ts">
  export default {
    name: 'Dashboard',
  };
</script>
