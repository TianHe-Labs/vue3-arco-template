<script lang="ts" setup>
  import { ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import * as XLSX from 'xlsx';
  import SheetTable from '@/components/sheet-table/index.vue';

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

  // 导出数据
  const handleExportData = () => {
    const worksheet = XLSX.utils.json_to_sheet(sheetTableData.value, {
      header: sheetTableColumns.map((item) => item.label),
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '数据');
    XLSX.writeFile(workbook, '数据.xlsx');
  };

  // 下载模板
  const handleDownloadTemplate = () => {
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

  // 表格列配置 表头
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
  <!-- 在线简易表格 -->
  <a-card>
    在线简易表格 更多使用案例，参见 数据管理 或人员管理 中的批量新增功能逻辑

    <br />
    <br />

    sheetTableData: {{ sheetTableData }}
    <SheetTable v-model="sheetTableData" :columns="sheetTableColumns" />

    <div class="flex gap-2 mt-4">
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

      <a-button type="text" @click="handleExportData"> 导出数据 </a-button>
    </div>
  </a-card>
</template>
