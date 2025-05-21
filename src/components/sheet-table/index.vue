<script lang="ts" setup>
  import { shallowRef, watch } from 'vue';
  import Spreadsheet from 'x-data-spreadsheet';

  interface Column {
    key: string;
    label: string;
  }

  const props = defineProps<{
    data: any[];
    columns: Column[]; // 指定表头信息
    rowHeight?: number; // 行高
    colWidth?: number; // 列宽
    width?: number; // 宽度
    height?: number; // 高度
  }>();

  const emits = defineEmits<{
    (event: 'update', data: any[]): void;
  }>();

  const spreadsheetRef = shallowRef<any>();

  let spreadsheetInstance: any = null;
  watch([spreadsheetRef, () => props.data], () => {
    if (spreadsheetRef.value) {
      if (!spreadsheetInstance) {
        spreadsheetInstance = new Spreadsheet(spreadsheetRef.value, {
          showToolbar: false,
          showBottomBar: false,
          showContextmenu: false,
          view: {
            height: () => props.height || document.documentElement.clientHeight,
            width: () => props.width || document.documentElement.clientHeight,
          },
          row: {
            height: props.rowHeight || 30,
            len: 500,
          },
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
    }

    const data = {
      rows: {
        0: {
          cells: props.columns.reduce((acc: any, column, index) => {
            acc[index] = {
              text: column.label,
            };
            return acc;
          }, {} as any),
        },

        ...props.data?.reduce((acc: any, cur, index) => {
          acc[index + 1] = {
            cells: props.columns.map((column) => ({
              text: cur[column.key]?.replace(/\s+/g, ''),
            })),
          };
          return acc;
        }, {} as any),
      },
      cols: {
        len: props.columns.length,
      },
    };
    spreadsheetInstance.loadData(data); // load data
    // spreadsheetInstance.cellText();
    spreadsheetInstance.validate();

    // console.log(spreadsheetInstance.getData());

    spreadsheetInstance.change((changedData: any) => {
      const updatedData = Object.values(changedData.rows).map((row: any) =>
        props.columns.reduce((acc: any, column, index) => {
          if (row.cells?.[index] && row.cells[index]?.text) {
            acc[column.key] = row.cells?.[index]?.text?.replace(/\s+/g, '');
          }
          // 去除空格
          return acc;
        }, {} as any),
      );
      emits('update', updatedData.slice(1)); // 去掉表头
    });
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
