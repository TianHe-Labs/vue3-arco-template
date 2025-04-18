// 工具函数·数据转换类transform X 或者 X2Y：名词词性

import { isNumber } from './is';

/**
 * 将枚举对象转换为数组
 * @example
 * enum Status {
 *   Active = 1,
 *   Inactive = 2
 * }
 * const arr = enum2Arr(Status); // [1, 2]
 *
 * enum Direction {
 *   Up = 'UP',
 *   Down = 'DOWN'
 * }
 * const arr = enum2Arr(Direction); // ['UP', 'DOWN']
 * @param obj 枚举对象
 * @returns 包含枚举值的数组
 */
export function enum2Arr(obj: object) {
  // 当枚举值是数字时，Object.values 会将枚举键页列举出来，因此需要排除掉
  const arr = Object.values(obj);
  const hasNumber = arr.some((item) => isNumber(item));
  if (hasNumber) {
    return arr.filter((item) => isNumber(item));
  }
  return arr;
}

export function matchNumber(obj: any) {
  if (typeof obj !== 'string') return NaN;
  const matched = obj.match(/\d+/g);
  if (!matched) return NaN;
  return Number(matched.join(''));
}

export function example() {
  return true;
}
