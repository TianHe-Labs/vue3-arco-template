<script lang="ts" setup>
  import { inject, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import * as XLSX from 'xlsx';
  import { useWindowSize } from '@vueuse/core';
  import SheetTable from '@/components/sheet-table/index.vue';
  import { useSearchXxxx } from '../composables/search';
  import { useBatchCreateXxxx } from '../composables/batch-create';

  const breakpoints = inject('breakpoints') as any;
  // 获取窗口大小
  const { height } = useWindowSize();

  // 检索
  const { fetchData } = useSearchXxxx();

  // 创建
  const {
    batchCreateXxxxPanelVisible,
    batchCreateXxxxModel,
    handleSubmitBatchCreateXxxx,
  } = useBatchCreateXxxx();

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
              const [name, description, tags] = item;
              return {
                name: name || '',
                description: description || '',
                tags: tags || '',
              };
            });
          batchCreateXxxxModel.value = [
            ...batchCreateXxxxModel.value,
            ...uploadData,
          ];
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

  const handleDownloadTemplate = () => {
    const templateData = [
      ['名称', '描述', '标签'],
      ['特征提取', '特征提取', '特征提取'],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'XX信息模板');

    // 设置列宽
    worksheet['!cols'] = [
      { width: 20 }, // 名称
      { width: 20 }, // 描述
      { width: 30 }, // 标签
    ];

    XLSX.writeFile(workbook, 'XX信息模板.xlsx');
  };

  // 表格列配置 表头
  const createNetizenColumns = [
    {
      label: '名称',
      key: 'name',
      required: true, // 必须字段
    },
    {
      label: '描述',
      key: 'description',
      required: true, // 必须字段
    },
    {
      label: '标签',
      key: 'tags',
      required: true, // 必须字段
    },
  ];
</script>

<template>
  <a-modal
    v-model:visible="batchCreateXxxxPanelVisible"
    title-align="start"
    title="新增XX"
    :width="768"
    :fullscreen="breakpoints.smallerOrEqual('md').value"
    :body-style="{
      padding: '0px',
      height: 'calc(100vh - 113px)',
      overflow: 'hidden',
    }"
  >
    <!-- 表格组件 -->
    <SheetTable
      v-model="batchCreateXxxxModel"
      :columns="createNetizenColumns"
      :col-width="236"
      :height="Number(height) - 113"
      :width="768"
    />

    <!-- 自定义footer -->
    <template #footer>
      <div class="flex items-center justify-between w-full gap-3">
        <!-- 只利用组件，不执行真正的上传逻辑，前端读取文件内容填入表格 -->
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
        <a-button type="text" @click="handleDownloadTemplate">
          下载模板
        </a-button>

        <!-- 占位挤压 -->
        <div class="flex-auto"></div>

        <!-- 右侧默认按钮 -->
        <a-button @click="batchCreateXxxxPanelVisible = false">取消</a-button>
        <a-button @click="batchCreateXxxxModel = []">清空</a-button>
        <a-button
          type="primary"
          @click="
            handleSubmitBatchCreateXxxx(() => fetchData({ hideLoading: true }))
          "
        >
          确定
        </a-button>
      </div>
    </template>
  </a-modal>
</template>
