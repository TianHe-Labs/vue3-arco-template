// 工具函数·数据格式化类

// 时间格式化，不要对 dayjs 二次封装
import dayjsExt from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjsExt.locale('zh-cn');
dayjsExt.extend(relativeTime);
dayjsExt.extend(localizedFormat);

export const dayjs = dayjsExt;

// 数字格式化 千位分隔符
export function formatNumber(obj: number, separator = ','): string {
  if (typeof obj !== 'number') return 'Invalid Number';
  // separator 分隔符，默认逗号 ,
  return obj.toString().replace(/(\d)(?=(?:\d{3})+$)/g, `$1${separator}`);
}

// 数字格式化 英文单位，千进位
export function formatNumberEnAbbr(obj: number): string {
  if (typeof obj !== 'number') return 'Invalid Number';
  if (obj === 0) return '0';
  // base 底数
  const base = 1000;
  // 取对数匹配单位
  const symbols = ['', 'K', 'M', 'B', 'T'];
  const i = Math.floor(Math.log(obj) / Math.log(base));
  return `${(obj / base ** i).toFixed(1)} ${symbols[i]}`;
}

// 数字格式化 中文单位，万进位
export function formatNumberZhAbbr(obj: number): string {
  if (typeof obj !== 'number') return 'Invalid Number';
  if (obj === 0) return '0';
  // base 底数
  const base = 10000;
  // 取对数匹配单位
  const symbols = ['', ' 万', ' 亿', ' 万亿'];
  const i = Math.floor(Math.log(obj) / Math.log(base));
  return `${(obj / base ** i).toFixed(1)} ${symbols[i]}`;
}

// 字节格式化
export function formatByte(obj: number): string {
  if (typeof obj !== 'number') return 'Invalid Number';
  if (obj === 0) return '0 B';
  // base 底数
  const base = 1024;
  // 取对数匹配单位
  const symbols = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(obj) / Math.log(base));
  return `${(obj / base ** i).toFixed(1)} ${symbols[i]}`;
}

// 简单 Markdown 解析
export function simpleMarkdownParser(obj: string) {
  // 解析加粗文本（**加粗**）
  let parsedText = obj.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 将单个换行替换为 `<br>`（除了列表项）
  parsedText = parsedText.replace(/([^\n])\n([^\d])/g, '$1<br>$2');

  // 分割为行，逐行解析有序列表
  const lines = parsedText.split('\n');
  const parsedLines = lines.map((line) => {
    const listItemMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (listItemMatch) {
      return `<li>${listItemMatch[2]}</li>`;
    }
    return `<div>${line}</div>`;
  });

  // 处理列表项并将它们包裹在 `<ol>` 中
  const listItems = parsedLines
    .filter((line) => line.startsWith('<li>'))
    .join('');
  const nonListItems = parsedLines
    .filter((line) => line.startsWith('<div>'))
    .join('');

  return `
        <div>
            ${nonListItems}
            ${listItems ? `<ol>${listItems}</ol>` : ''}
        </div>
    `;
}
