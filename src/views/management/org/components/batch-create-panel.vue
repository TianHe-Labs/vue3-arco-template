<script lang="ts" setup>
  import { inject, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import * as XLSX from 'xlsx';
  import { useWindowSize } from '@vueuse/core';
  import SheetTable from '@/components/sheet-table/index.vue';
  import { useSearchOrg } from '../composables/search';
  import { useBatchCreateOrg } from '../composables/batch-create';

  const breakpoints = inject('breakpoints') as any;

  // 获取窗口大小
  const { height } = useWindowSize();

  // 检索
  const { fetchData } = useSearchOrg();

  // 创建
  const {
    batchCreateOrgPanelVisible,
    batchCreateOrgModel,
    handleSubmitBatchCreateOrg,
  } = useBatchCreateOrg();

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
              const [orgName, orgDescription, parentOrgName] = item;
              return {
                orgName: orgName || '',
                orgDescription: orgDescription || '',
                parentOrgName: parentOrgName || '',
              };
            });
          batchCreateOrgModel.value = [
            ...batchCreateOrgModel.value,
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

  // 导出模板
  const handleDownloadTemplate = () => {
    const templateData = [
      ['部门名称', '部门描述', '上级部门'],
      ['XXX市AS分局', 'XXX市AS分局描述', 'XXX市'],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '部门信息模板');

    // 设置列宽
    worksheet['!cols'] = [
      { width: 20 }, // 部门名称
      { width: 40 }, // 部门描述
      { width: 20 }, // 上级部门
    ];

    XLSX.writeFile(workbook, '部门信息模板.xlsx');
  };

  const createNetizenColumns = [
    {
      label: '部门名称',
      key: 'orgName',
      required: true, // 必须字段
    },
    {
      label: '部门描述',
      key: 'orgDescription',
      required: true, // 必须字段
    },
    {
      label: '上级部门',
      key: 'parentOrgName',
      required: true, // 必须字段
    },
  ];
</script>

<template>
  <a-modal
    v-model:visible="batchCreateOrgPanelVisible"
    title-align="start"
    title="新增部门"
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
      v-model="batchCreateOrgModel"
      :columns="createNetizenColumns"
      :col-width="242"
      :height="Number(height) - 113"
      :width="1024"
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
        <a-button @click="batchCreateOrgPanelVisible = false">取消</a-button>
        <a-button @click="batchCreateOrgModel = []">清空</a-button>
        <a-button
          type="primary"
          @click="
            handleSubmitBatchCreateOrg(() => fetchData({ hideLoading: true }))
          "
        >
          确定
        </a-button>
      </div>
    </template>
  </a-modal>
</template>
