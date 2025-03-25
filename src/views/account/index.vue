<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <Breadcrumb :items="['账号设置']" />
    <div class="grid md:grid-cols-2 gap-4">
      <BasicInfo />
      <Password />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import BasicInfo from './components/basic-info.vue';
  import Password from './components/password.vue';
</script>

<script lang="ts">
  export default {
    name: 'Account',
  };
</script>
