<script setup lang="ts">
  const slogan = import.meta.env.VITE_APP_SLOGAN;
  const subSlogan = import.meta.env.VITE_APP_SUB_SLOGAN;
</script>

<template>
  <div
    class="flex flex-col justify-center items-center gap-4"
    style="
      background: linear-gradient(
          217deg,
          rgba(var(--primary-9)),
          rgb(1 1 1 / 75%) 72%
        ),
        linear-gradient(172deg, rgba(var(--primary-5)), rgb(1 1 1 / 75%) 72%);
    "
  >
    <div v-if="slogan" class="text-xl text-fill-1"> {{ slogan }} </div>
    <p v-if="slogan && subSlogan" class="text-text-3"> {{ subSlogan }} </p>
    <img class="w-2/3" src="@/assets/images/login-banner.png" />
  </div>
</template>
