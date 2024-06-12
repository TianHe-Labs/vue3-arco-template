// 工具函数·数据转换类transform X 或者 X2Y：名词词性

import { isNumber } from './is';

export function enum2Arr(obj: object) {
  // 当枚举值是数字时，Object.values 会将枚举键页列举出来，因此需要排除掉
  const arr = Object.values(obj);
  const hasNumber = arr.some((item) => isNumber(item));
  if (hasNumber) {
    return arr.filter((item) => isNumber(item));
  }
  return arr;
}

export function example() {
  return true;
}
