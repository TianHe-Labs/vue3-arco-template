import { CallbackDataParams } from 'echarts/types/dist/shared';

// 图表的提示框格式化参数
export interface ToolTipFormatterParams extends CallbackDataParams {
  axisDim: string;
  axisIndex: number;
  axisType: string;
  axisId: string;
  axisValue: string;
  axisValueLabel: string;
}

// 分页
export interface Pagination {
  current: number;
  pageSize: number;
}

export interface List<T> {
  // 总数，有些地方不需要
  total?: number;
  // 为了拓展性，列表数据放在 list 下
  list: T[];
}

// 表格的多选状态
export interface SelectionState {
  visible: boolean;
  checked: string[];
}

// 检索插件的模糊匹配
export interface FuzzyQueryModel {
  fuzzyText: string;
  fuzzyKeys: string[];
}
