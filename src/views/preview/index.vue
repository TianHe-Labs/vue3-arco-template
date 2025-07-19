<script lang="ts" setup>
  import { h, ref, shallowRef } from 'vue';
  import IconHeart from '@arco-design/web-vue/es/icon/icon-heart';
  import { Message } from '@arco-design/web-vue';
  import * as XLSX from 'xlsx';
  import {
    dayjs,
    formatNumber,
    formatNumberEnAbbr,
    formatNumberZhAbbr,
  } from '@/utils/format';
  import { enum2Arr } from '@/utils/transform';
  import { USERROLE } from '@/store/modules/user/types.d';
  import Banner from './components/banner.vue';
  import StackBarDist from './components/stack-bar-dist.vue';
  import DynamicTag from '@/components/dynamic-tag/index.vue';
  import ExtendedInputTag from '@/components/extended-input-tag/index.vue';
  import SheetTable from '@/components/sheet-table/index.vue';

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

  const handleAddButtonClick = () => {
    // 通过组件内的方法可以触发相关事件
    dynamicTagRef.value?.addTag({ id: '1', name: '标签一' });

    // 当然也可以直接修改绑定的变量值
    // dynamicTags.value.push({ id: '1', name: '标签一' });
  };

  const sheetTableData = ref<any[]>([]);

  // onBeforeUpload
  // 通过钩子读取文件内容，填入表格
  const onBeforeUpload = (file: File) => {
    // 检查文件类型
    const acceptFileTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!acceptFileTypes.includes(file.type)) {
      Message.error('请选择Excel文件（.xlsx或.xls格式）');
      return false;
    }
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (event) => {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const uploadData = (jsonData as any[][])
            .slice(1)
            .map((item: any[]) => {
              const [name, phone, email] = item;
              return {
                name: name || '',
                phone: phone || '',
                email: email || '',
              };
            });
          sheetTableData.value = [...sheetTableData.value, ...uploadData];
          Message.success(
            `已导入 ${uploadData.length} 条记录，检查无误后点击确定按钮进行提交`,
          );
          resolve(false);
        };
      } catch (error: any) {
        reject(error);
      }
    });
  };

  const handleExportData = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(sheetTableData.value);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '数据');
    XLSX.writeFile(workbook, '数据.xlsx');
  };

  const handleExportTemplate = () => {
    // 和 sheetTableColumns 保持一致
    const templateData = [
      ['姓名', '手机', '邮箱'],
      ['张三', '13800138000', 'zhangsan@example.com'],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '信息模板');

    // 设置列宽
    worksheet['!cols'] = [
      { width: 15 }, // 姓名
      { width: 15 }, // 手机
      { width: 20 }, // 邮箱
    ];

    XLSX.writeFile(workbook, '信息模板.xlsx');
  };

  const sheetTableColumns = [
    {
      key: 'name',
      label: '姓名',
    },
    {
      key: 'phone',
      label: '手机',
    },
    {
      key: 'email',
      label: '邮箱',
    },
  ];
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4">
    <Breadcrumb :items="['menu.preview']" />
    <Banner />
    <StackBarDist />

    <div class="flex flex-col gap-4 p-4 bg-bg-2">
      {{ inputTags }}

      <ExtendedInputTag v-model="inputTags" />

      {{ dynamicTags }}

      <!-- 开启 customMode 属性，监听 add-button-click 事件 -->
      <DynamicTag
        v-model="dynamicTags"
        ref="dynamicTagRef"
        value-key="id"
        :unique-value="true"
        :custom-mode="true"
        :format-icon="formatTagIcon"
        :format-tag="formatTagLabel"
        class="grid grid-cols-2"
        @add-button-click="handleAddButtonClick"
      />

      <!-- 或者使用具名插槽格式化 -->
      <DynamicTag
        v-model="dynamicTags"
        ref="dynamicTagRef"
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

      <div> 当前时间：{{ dayjs().format('L LTS') }} </div>

      <div>
        事件格式化 dayjs()： 2000-04-18 12:00:00 距今
        {{ dayjs('2000-04-18 12:00:00').fromNow() }}
      </div>

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

      <div> 用户角色（类型定义转数组）：{{ enum2Arr(USERROLE) }} </div>

      <br />

      <!-- 在线简易表格 -->

      <!-- 只利用组件，不执行真正的上传逻辑，前端读取文件内容填入表格 -->
      <div class="flex gap-2">
        <a-upload
          action="/"
          accept=".xlsx,.xls"
          :auto-upload="false"
          :show-file-list="false"
          @before-upload="onBeforeUpload"
        >
          <template #upload-button>
            <a-button type="outline"> 文件导入 </a-button>
          </template>
        </a-upload>
        <a-button type="text" @click="handleExportTemplate">
          下载模板
        </a-button>

        <a-button type="text" @click="handleExportData"> 导出数据 </a-button>
      </div>
      {{ sheetTableData }}
      <SheetTable v-model="sheetTableData" :columns="sheetTableColumns" />
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'Preview',
  };
</script>
