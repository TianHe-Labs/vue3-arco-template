<script lang="ts" setup>
  import { inject, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import * as XLSX from 'xlsx';
  import { useWindowSize } from '@vueuse/core';
  import SheetTable from '@/components/sheet-table/index.vue';
  import { useSearchUser } from '../composables/search';
  import { useBatchCreateUser } from '../composables/batch-create';

  const breakpoints = inject('breakpoints') as any;
  // 获取窗口大小
  const { height } = useWindowSize();

  // 检索
  const { fetchData } = useSearchUser();

  // 创建
  const {
    batchCreateUserPanelVisible,
    batchCreateUserModel,
    handleSubmitBatchCreateUser,
  } = useBatchCreateUser();

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
              const [
                username,
                nickname,
                verification,
                phone,
                email,
                orgName,
                role,
              ] = item;
              return {
                username: username || '',
                nickname: nickname || '',
                verification: verification || '',
                phone: phone || '',
                email: email || '',
                orgName: orgName || '',
                role: role || '',
              };
            });
          batchCreateUserModel.value = [
            ...batchCreateUserModel.value,
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
      ['用户名', '昵称', '手机号', '邮箱', '部门', '角色'],
      ['admin', '管理员', '13800138000', 'admin@example.com', '市局', '管理员'],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '用户信息模板');

    // 设置列宽
    worksheet['!cols'] = [
      { width: 20 }, // 用户名
      { width: 20 }, // 昵称
      { width: 30 }, // 手机号
      { width: 30 }, // 邮箱
      { width: 50 }, // 部门
      { width: 50 }, // 角色
    ];

    XLSX.writeFile(workbook, '用户信息模板.xlsx');
  };

  // 表格列配置 表头
  const createNetizenColumns = [
    {
      label: '用户名',
      key: 'username',
      required: true, // 必须字段
    },
    {
      label: '昵称',
      key: 'nickname',
      required: true, // 必须字段
    },
    {
      label: '手机号',
      key: 'phone',
      required: true, // 必须字段
    },
    {
      label: '邮箱',
      key: 'email',
      required: true, // 必须字段
    },
    {
      label: '部门',
      key: 'orgName',
      required: true, // 必须字段
    },
    {
      label: '角色',
      key: 'role',
      required: true, // 必须字段
    },
  ];
</script>

<template>
  <a-modal
    v-model:visible="batchCreateUserPanelVisible"
    title-align="start"
    title="新增用户"
    :width="1024"
    :fullscreen="breakpoints.smallerOrEqual('lg').value"
    :body-style="{
      padding: '0px',
      height: 'calc(100vh - 113px)',
      overflow: 'hidden',
    }"
  >
    <!-- 表格组件 -->
    <SheetTable
      v-model="batchCreateUserModel"
      :columns="createNetizenColumns"
      :col-width="162"
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
        <a-button @click="batchCreateUserPanelVisible = false">取消</a-button>
        <a-button @click="batchCreateUserModel = []">清空</a-button>
        <a-button
          type="primary"
          @click="
            handleSubmitBatchCreateUser(() => fetchData({ hideLoading: true }))
          "
        >
          确定
        </a-button>
      </div>
    </template>
  </a-modal>
</template>
