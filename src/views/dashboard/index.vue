<script lang="ts" setup>
  import Banner from './components/banner.vue';
  import StackBarDist from './components/stack-bar-dist.vue';
</script>

<script lang="ts">
  export default {
    name: 'Dashboard',
  };
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4">
    <Breadcrumb :items="['仪表盘']" />
    <Banner />
    <StackBarDist />
  </div>
</template>
