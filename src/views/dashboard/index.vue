<template>
  <div class="h-full flex px-5 py-4">
    <Banner />
  </div>
</template>

<script lang="ts" setup>
  import Banner from './components/banner.vue';
</script>

<script lang="ts">
  export default {
    name: 'Dashboard',
    // If you want the include property of keep-alive to take effect,
    // you must name the component
  };
</script>
