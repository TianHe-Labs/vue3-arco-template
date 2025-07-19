<script lang="ts" setup>
  import StackBarDist from './components/stack-bar-dist.vue';
  import GeoDist from './components/geo-dist.vue';
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4">
    <Breadcrumb :items="['menu.dashboard']" />
    <StackBarDist />
    <GeoDist />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'Dashboard',
  };
</script>
