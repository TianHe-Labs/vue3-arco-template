<script lang="ts" setup>
  import { useUserStore } from '@/store';

  const userStore = useUserStore();
</script>

<template>
  <a-card
    :bordered="false"
    :style="{
      background:
        'linear-gradient(217deg, rgba(var(--cyan-1)), rgba(255, 0, 0, 0) 70.71%),linear-gradient(127deg, rgba(var(--cyan-1)), rgba(0, 255, 0, 0) 70.71%), linear-gradient(336deg, rgba(var(--cyan-1)), rgba(0, 0, 255, 0) 70.71%)',
    }"
    class="py-4 text-center rounded shadow-sm"
  >
    <a-avatar
      :size="72"
      :style="{
        border: '3px solid var(--color-border-2)',
        background:
          'linear-gradient(217deg, rgba(var(--primary-5)), rgba(255, 0, 0, 0) 72%), linear-gradient(127deg, rgba(var(--primary-4)), rgba(0, 255, 0, 0) 72%), linear-gradient(336deg, rgba(var(--primary-3)), rgba(0, 0, 255, 0) 72%)',
      }"
    >
      <img v-if="userStore?.avatar" alt="avatar" :src="userStore?.avatar" />
      <span v-else-if="userStore?.nickname" class="uppercase">{{
        userStore?.nickname?.substring(0, 1)
      }}</span>
      <icon-user v-else />
    </a-avatar>
    <div class="my-3 font-medium text-text-1 text-lg">
      {{ userStore.nickname || userStore.username }}
    </div>

    <div class="flex justify-center items-center gap-3">
      <div v-if="userStore?.role" class="text-text-2">
        <icon-idcard />
        {{ $t(`account.roles.${userStore.role}`) }}
      </div>
      <div v-if="userStore?.sector" class="text-text-2">
        <icon-home />
        {{ userStore.sector }}
      </div>
      <div v-if="userStore?.status" class="text-text-2">
        <icon-bulb />
        {{ userStore.status }}
      </div>
    </div>
  </a-card>
</template>
