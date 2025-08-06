<script lang="ts" setup>
  import LoginLog from './components/login-log.vue';
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <Breadcrumb :items="['menu.account', 'menu.account.loginLog']" />

    <LoginLog />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'AccountInfo',
  };
</script>
