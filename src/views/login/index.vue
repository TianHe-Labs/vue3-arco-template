<template>
  <div class="h-screen flex">
    <div class="lg:w-500px banner">
      <LoginBanner />
    </div>
    <div class="flex-1 flex justify-center items-center content">
      <LoginForm />
      <Footer class="footer" />
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

  .content {
    position: relative;

    .footer {
      position: absolute;
      bottom: 0;
    }
  }
</style>
