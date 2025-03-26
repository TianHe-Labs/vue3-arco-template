<template>
  <div class="h-screen flex">
    <LoginBanner class="w-0px invisible lg:visible lg:w-560px" />
    <LoginForm class="self-center" />
    <Footer class="absolute bottom-0 left-0px lg:left-560px right-0" />
  </div>
</template>

<script lang="ts" setup>
  import Footer from '@/components/footer/index.vue';
  import LoginBanner from './components/banner.vue';
  import LoginForm from './components/login-form.vue';
</script>
