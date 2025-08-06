<script lang="ts" setup>
  import { h, ref, shallowRef } from 'vue';
  import IconHeart from '@arco-design/web-vue/es/icon/icon-heart';
  import {
    dayjs,
    formatNumber,
    formatNumberEnAbbr,
    formatNumberZhAbbr,
  } from '@/utils/format';
  import { enum2Arr } from '@/utils/transform';
  import { USERROLE } from '@/api/user';
  import Banner from './components/banner.vue';
  import DynamicTag from '@/components/dynamic-tag/index.vue';
  import ExtendedInputTag from '@/components/extended-input-tag/index.vue';
  import SheetTableExample from './components/sheet-table.vue';

  const inputTags = ref<string[]>([]);

  const dynamicTagRef = shallowRef<any>();
  const dynamicTags = ref<any[]>([]);
  // 标签数据映射
  const tagMap: Record<string, string> = {
    '1': '标签一',
    '2': '标签二',
    '3': '标签三',
  };
  // 格式化标签图标
  const formatTagIcon = (item: any) => {
    return h(IconHeart);
  };
  // 格式化标签显示值
  const formatTagLabel = (item: any) => {
    return item?.name || tagMap[item?.id || item] || item;
  };

  // 自定义标签添加模式
  const customDynamicTagRef = shallowRef<any>();
  const customDynamicTags = ref<any[]>([]);

  const handleAddButtonClick = () => {
    // 通过组件内的方法可以触发相关事件
    customDynamicTagRef.value?.addTag({ id: '1', name: '标签一' });

    // 当然也可以直接修改绑定的变量值
    // customDynamicTags.value.push({ id: '1', name: '标签一' });
  };
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4">
    <Breadcrumb :items="['menu.preview']" />
    <Banner />

    <div class="flex flex-col gap-4 p-4 bg-bg-2">
      动态标签输入框（基于 arcodesign input-tag 拓展），使用体验不如 DynamicTag

      <br />
      <br />

      inputTags: {{ inputTags }}

      <ExtendedInputTag v-model="inputTags" />

      <a-divider />

      动态标签添加，默认输入框添加标签

      <br />
      <br />

      dynamicTags: {{ dynamicTags }}

      <DynamicTag
        v-model="dynamicTags"
        ref="dynamicTagRef"
        value-key="id"
        :unique-value="true"
        :format-icon="formatTagIcon"
        :format-tag="formatTagLabel"
        class="grid grid-cols-2"
      />

      <a-divider />

      动态标签添加，通过 custom-mode 属性 和 @add-button-click
      事件开启自定义输入标签的模式

      <br />
      <br />

      customDynamicTags: {{ customDynamicTags }}

      <!-- 开启 customMode 属性，监听 add-button-click 事件 -->
      <DynamicTag
        v-model="customDynamicTags"
        ref="customDynamicTagRef"
        value-key="id"
        :unique-value="true"
        :custom-mode="true"
        :format-icon="formatTagIcon"
        :format-tag="formatTagLabel"
        class="grid grid-cols-2"
        @add-button-click="handleAddButtonClick"
      />

      <a-divider />

      动态标签添加，通过 custom-mode 属性 和
      @add-button-click，通过具名插槽实现自定义标签格式化

      <!-- 或者使用具名插槽格式化 -->
      <DynamicTag
        v-model="customDynamicTags"
        ref="customDynamicTagRef"
        value-key="id"
        :unique-value="true"
        :custom-mode="true"
        :format-icon="formatTagIcon"
        :format-tag="formatTagLabel"
        class="flex flex-col"
        @add-button-click="handleAddButtonClick"
      >
        <!-- 插槽形式编码更直观友好 -->
        <template #icon="{ item }">
          <!-- <component :is="formatTagIcon(item)" /> -->
          <icon-heart />
        </template>
        <template #default="{ item }">
          <!-- {{ formatTagLabel(item) }} -->
          {{ item.name }}
        </template>
      </DynamicTag>

      <a-divider />

      <div> 当前时间：{{ dayjs().format('L LTS') }} </div>

      <div>
        时间格式化 dayjs()： 2000-04-18 12:00:00 距今
        {{ dayjs('2000-04-18 12:00:00').fromNow() }}
      </div>

      <a-divider />

      <div>
        209032323 千位分隔符格式化 formatNumber：{{ formatNumber(209032323) }}
      </div>

      <div>
        209032323 英文单位格式化 formatNumberEnAbbr：{{
          formatNumberEnAbbr(209032323)
        }}
      </div>

      <div>
        209032323 中文单位格式化 formatNumberZhAbbr：{{
          formatNumberZhAbbr(209032323)
        }}
      </div>

      <a-divider />

      <div> 用户角色（类型定义转数组）：{{ enum2Arr(USERROLE) }} </div>

      <a-divider />
    </div>

    <SheetTableExample />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'Preview',
  };
</script>
