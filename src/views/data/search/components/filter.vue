<script lang="ts" setup>
  import { useSearchXxxx } from '../composables/search';

  const {
    queryFormRef,
    queryModel,
    fuzzyQueryModel,
    fetchData,
    handleResetQueryModel,
  } = useSearchXxxx();

  // 非业务逻辑，仅在页面显示，不写在 composable 中
  // const fuzzyKeyOptions = fuzzyKeys.map((value) => ({
  //   label: value,
  //   value,
  // }));

  const fuzzyKeyOptions = [
    {
      label: '名称',
      value: 'name',
    },
    {
      label: '描述',
      value: 'description',
    },
  ];
</script>

<template>
  <a-card :bordered="false" :body-style="{ paddingTop: '20px' }">
    <a-form ref="queryFormRef" :model="queryModel" auto-label-width>
      <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-x-4">
        <!-- 精确匹配 -->
        <a-form-item field="id" label="ID" :rules="[]">
          <a-select
            v-model="queryModel.id"
            allow-clear
            allow-create
            allow-search
            placeholder="XXX"
          />
        </a-form-item>
        <!-- 精确匹配 -->
        <a-form-item field="tags" label="标签">
          <a-select
            v-model="queryModel.tags"
            multiple
            allow-clear
            allow-create
            allow-search
          />
        </a-form-item>

        <!-- 指定属性的全文检索 -->
        <a-form-item
          label="全文检索"
          class="lg:col-span-2 xl:col-span-3"
          content-class="flex-wrap gap-2"
        >
          <a-input-search
            v-model="fuzzyQueryModel.fuzzyWord"
            allow-clear
            placeholder="输入检索关键字"
            @press-enter="fetchData"
            @clear="fetchData"
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
                  <div p="x-4 y-2" text="text-3"> 选择匹配属性 </div>
                </template>
              </a-select>
            </template>
          </a-input-search>
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

    <a-divider class="!mt-0" />

    <div class="h-full flex gap-4">
      <!-- 占位将左、右多个元素分别挤压到两侧，减少标签嵌套 -->
      <div class="flex-auto"></div>
      <a-button @click="handleResetQueryModel()">
        <template #icon>
          <icon-refresh />
        </template>
        重置
      </a-button>
      <a-button type="primary" @click="fetchData">
        <template #icon>
          <icon-search />
        </template>
        检索
      </a-button>
    </div>
  </a-card>
</template>
