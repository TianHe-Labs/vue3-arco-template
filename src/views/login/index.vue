<template>
  <div class="h-screen flex">
    <div class="lg:w-500px banner">
      <LoginBanner />
    </div>
    <div class="flex-auto relative flex justify-center items-center">
      <LoginForm />
      <Footer class="absolute bottom-0" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Footer from '@/components/footer/index.vue';
  import LoginBanner from './components/banner.vue';
  import LoginForm from './components/login-form.vue';
</script>

<style lang="less" scoped>
  .banner {
    background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
  }
</style>
