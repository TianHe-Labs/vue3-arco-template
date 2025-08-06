<script lang="ts" setup generic="T extends Record<string, any>">
  import { shallowRef, watch, nextTick } from 'vue';
  import Spreadsheet from 'x-data-spreadsheet';

  interface Column {
    key: string;
    label: string;
  }

  const props = defineProps<{
    modelValue: T[];
    columns: Column[]; // 指定表头信息
    rowHeight?: number; // 行高
    colWidth?: number; // 列宽
    width?: number; // 宽度
    height?: number; // 高度
  }>();

  const emits = defineEmits<{
    (event: 'update:modelValue', value: any[]): void;
  }>();

  const spreadsheetRef = shallowRef<any>();

  const spreadsheetInstance = shallowRef<Spreadsheet | null>(null);

  // 是否正在更新 （表格中输入， 防止循环依赖，重复触发）
  const isUpdating = shallowRef(false);

  watch([spreadsheetRef, () => props.modelValue], () => {
    if (!spreadsheetInstance.value && spreadsheetRef.value) {
      spreadsheetInstance.value = new Spreadsheet(spreadsheetRef.value, {
        showToolbar: false,
        showBottomBar: false,
        showContextmenu: false,
        view: {
          height: () => props.height || document.documentElement.clientHeight,
          width: () => props.width || document.documentElement.clientHeight,
        },
        // row: {
        //   height: props.rowHeight || 40,
        //   len: 500,
        // },
        col: {
          len: props.columns.length,
          width:
            props.colWidth ||
            ((props.width || document.documentElement.clientHeight) - 60) /
              props.columns.length ||
            256,
          indexWidth: 60,
          minWidth: props.colWidth || 256,
        },
      });
    }

    if (isUpdating.value) {
      return;
    }

    const data = {
      // 冻结表头
      freeze: 'A2',
      // 合并单元格
      merges: [],
      // 样式
      styles: [
        {
          bgcolor: '#f4f5f8',
          textwrap: true,
          color: '#900b09',
          border: {
            top: ['thin', '#0366d6'],
            bottom: ['thin', '#0366d6'],
            right: ['thin', '#0366d6'],
            left: ['thin', '#0366d6'],
          },
        },
      ],
      rows: {
        0: {
          cells: props.columns.reduce((acc: any, column, index) => {
            acc[index] = {
              text: column.label,
            };
            return acc;
          }, {} as any),
        },

        ...props.modelValue?.reduce((acc: any, cur, index) => {
          acc[index + 1] = {
            cells: props.columns.map((column) => ({
              text: cur[column.key]?.replace(/\s+/g, ''),
            })),
          };
          return acc;
        }, {} as T),
      },
      cols: {
        len: props.columns.length,
      },
    };
    // spreadsheetInstance.value?.sheet?.freeze(1, 1);
    spreadsheetInstance.value?.loadData(data); // load data
    // spreadsheetInstance.cellText();
    // spreadsheetInstance.value?.validate();

    // console.log(spreadsheetInstance.getData());
  });

  watch(spreadsheetInstance, () => {
    if (spreadsheetInstance.value) {
      spreadsheetInstance.value?.change((changedData: any) => {
        isUpdating.value = true;
        const updatedData = Object.values(changedData.rows).map((row: any) =>
          props.columns.reduce((acc: any, column, index) => {
            if (row.cells?.[index] && row.cells[index]?.text) {
              acc[column.key] = row.cells?.[index]?.text?.replace(/\s+/g, '');
            }
            // 去除空格
            return acc;
          }, {} as any),
        );
        emits(
          'update:modelValue',
          updatedData
            .slice(1)
            .filter((item: any) =>
              Object.values(item).some((value: any) => value !== ''),
            ),
        ); // 去掉表头和空数据
        nextTick(() => {
          isUpdating.value = false;
        });
      });
    }
  });
</script>

<template>
  <div ref="spreadsheetRef"></div>
</template>

<style>
  .x-spreadsheet-scrollbar.horizontal {
    display: none !important;
  }
</style>
