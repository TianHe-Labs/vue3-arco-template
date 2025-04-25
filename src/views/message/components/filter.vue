<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { enum2Arr } from '@/utils/transform';
  import { USERROLE } from '@/store/modules/user/types';
  import { dayjs } from '@/utils/format';
  import { messageTypes } from '@/api/message';
  import { useMessage } from '../composables/message';
  import { computed } from 'vue';

  const {
    queryPanelVisible,
    queryFormRef,
    queryModel,
    fuzzyQueryModel,
    renderStats,
    fetchData,
    handleResetQueryModel,
  } = useMessage();

  // 全文检索关键字匹配的属性
  const fuzzyKeyOptions = [
    {
      label: '消息标题',
      value: 'title',
    },
    {
      label: '消息内容',
      value: 'content',
    },
  ];

  // 预设时间范围快捷选择
  const shortcuts = [7, 15, 30, 90].map((value) => ({
    label: `近 ${value} 天`,
    value: () => [
      dayjs().subtract(value, 'day').startOf('day'),
      dayjs().endOf('day'),
    ],
  }));

  const { t } = useI18n();
  const typeOptions = computed(() =>
    messageTypes.map((value) => ({
      label: `${t(`message.type.${value}`)} (${renderStats.value[value]})`,
      value,
    })),
  );
</script>
<template>
  <transition name="fade">
    <a-card
      v-show="queryPanelVisible"
      :bordered="false"
      :body-style="{ paddingTop: '20px', paddingBottom: '4px' }"
    >
      <a-form ref="queryFormRef" :model="queryModel" auto-label-width>
        <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-x-4">
          <!-- 消息类型 -->
          <a-form-item field="type" label="消息类型" :rules="[]">
            <a-checkbox-group
              v-model="queryModel.types"
              :options="typeOptions"
            />
          </a-form-item>
          <!-- 生成时间 -->
          <a-form-item field="createdRange" label="生成时间" :rules="[]">
            <a-range-picker
              v-model="queryModel.createdRange"
              show-time
              :time-picker-props="{
                defaultValue: ['00:00:00', '23:59:59'],
              }"
              :shortcuts="shortcuts"
              allow-clear
              class="!w-full"
            />
          </a-form-item>
          <!-- 阅读时间 -->
          <a-form-item field="readRange" label="阅读时间" :rules="[]">
            <a-range-picker
              v-model="queryModel.readRange"
              show-time
              :time-picker-props="{
                defaultValue: ['00:00:00', '23:59:59'],
              }"
              :shortcuts="shortcuts"
              allow-clear
              class="!w-full"
            />
          </a-form-item>

          <!-- 指定属性的全文检索 -->
          <a-form-item
            label="全文检索"
            class="lg:col-span-2 xl:col-span-3"
            content-class="flex-wrap gap-2"
          >
            <a-input
              v-model="fuzzyQueryModel.fuzzyWord"
              allow-clear
              placeholder="输入全文检索关键字"
              @press-enter="fetchData"
            >
              <template #suffix>
                <a-divider
                  direction="vertical"
                  class="!hidden !lg:inline-block"
                />
                <a-select
                  v-model="fuzzyQueryModel.fuzzyKeys"
                  multiple
                  show-header-on-empty
                  :bordered="false"
                  :max-tag-count="2"
                  :allow-search="false"
                  :show-extra-options="false"
                  :options="fuzzyKeyOptions"
                  placeholde="选择关键字要匹配的属性"
                  class="!hidden !lg:flex !p-0 flex-none !w-240px custom-select"
                >
                  <template #arrow-icon>
                    <icon-select-all />
                  </template>
                  <template #header>
                    <div p="x-4 y-2">选择全文检索属性</div>
                  </template>
                </a-select>
              </template>
            </a-input>
            <a-select
              v-model="fuzzyQueryModel.fuzzyKeys"
              multiple
              show-header-on-empty
              :allow-search="false"
              :show-extra-options="false"
              :options="fuzzyKeyOptions"
              placeholde="选择关键字要匹配的属性"
              class="!lg:hidden"
            >
              <template #arrow-icon>
                <icon-select-all />
              </template>
              <template #header>
                <div p="x-4 y-2" text="text-3"> 选择匹配属性 </div>
              </template>
            </a-select>
          </a-form-item>
        </div>
      </a-form>
    </a-card>
  </transition>
</template>
