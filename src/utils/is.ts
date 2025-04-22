const opt = Object.prototype.toString;

export function isArray(obj: any): obj is any[] {
  return opt.call(obj) === '[object Array]';
}

export function isObject(obj: any): obj is { [key: string]: any } {
  return opt.call(obj) === '[object Object]';
}

export function isString(obj: any): obj is string {
  return opt.call(obj) === '[object String]';
}

export function isNumber(obj: any): obj is number {
  return opt.call(obj) === '[object Number]' && obj === obj; // eslint-disable-line
}

export function isRegExp(obj: any) {
  return opt.call(obj) === '[object RegExp]';
}

export function isFile(obj: any): obj is File {
  return opt.call(obj) === '[object File]';
}

export function isBlob(obj: any): obj is Blob {
  return opt.call(obj) === '[object Blob]';
}

export function isUndefined(obj: any): obj is undefined {
  return obj === undefined;
}

export function isNull(obj: any): obj is null {
  return obj === null;
}

export function isFunction(obj: any): obj is (...args: any[]) => any {
  return typeof obj === 'function';
}

export function isEmptyObject(obj: any): boolean {
  return isObject(obj) && Object.keys(obj).length === 0;
}

export function isExist(obj: any): boolean {
  return obj || obj === 0;
}

export function isWindow(el: any): el is Window {
  return el === window;
}

export function isPhone(obj: any): boolean {
  return /^1[3-9]\d{9}$/.test(obj);
}

export function isEmail(obj: any): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(obj);
}

export function isDomain(obj: any): boolean {
  return /^[a-zA-Z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,6}$/.test(obj);
}

export function isIpv4(obj: any): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(obj);
}

export function isIpv4Cidr(obj: any): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(obj);
}

export function isIpv6(obj: any): boolean {
  return /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(obj);
}

export function isIpv6Cidr(obj: any): boolean {
  return /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\/\d{1,2}$/.test(obj);
}

export function isIp(obj: any): boolean {
  return isIpv4(obj) || isIpv6(obj);
}

export function isIpCidr(obj: any): boolean {
  return isIpv4Cidr(obj) || isIpv6Cidr(obj);
}

export function isMac(obj: any): boolean {
  return /^([0-9a-fA-F]{2}-){5}[0-9a-fA-F]{2}$/.test(obj);
}
