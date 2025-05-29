import type { RouteRecordNormalized } from 'vue-router';
import axios from 'axios';
import { UserState } from '@/store/modules/user/types.d';

// 登录
export type LoginReq = Pick<UserState, 'username' | 'password'>;
export type LoginRes = Pick<UserState, 'accessToken' | 'refreshToken'>;

export function login(data: LoginReq) {
  // 有时候前端的有些字段和后端接口不一致
  // 为了避免大面积修改变量，可以只在接口这里做一下映射处理
  const cleanedData = { ...data, account: data.username };
  return axios.post<LoginRes>('/api/user/login', cleanedData);
}

// 刷新令牌
export type UpdateRefreshTokenReq = Pick<UserState, 'refreshToken'>;
export type UpdateRefreshTokenRes = Pick<UserState, 'accessToken'>;

export function updateUserToken(data: UpdateRefreshTokenReq) {
  return axios.get<UpdateRefreshTokenRes>('/api/user/refresh', {
    headers: {
      Authorization: `Bearer ${data.refreshToken}`,
    },
  });
}

// 获取用户信息
export type QueryUserInfoRes = Omit<
  UserState,
  'password' | 'accessToken' | 'refreshToken'
> & { [key: string]: any };

export function queryUserInfo() {
  return axios.get<QueryUserInfoRes>('/api/user/info');
}

// 获取用户菜单（由后端完全控制登录用户路由权限）
export function queryServerMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

// 更新用户信息（除密码）
export type UpdateUserInfoReq = Omit<
  UserState,
  'id' | 'password' | 'accessToken' | 'refreshToken'
>;
export type UpdateUserInfoRes = Pick<UserState, 'username'>;

export function updateUserInfo(data: UpdateUserInfoReq) {
  // 有时候前端的有些字段和后端接口不一致
  // 为了避免大面积修改变量，可以只在接口这里做一下映射处理
  const cleanedData = {
    ...data,
    account: data.username,
    name: data.nickname,
  };
  return axios.put<UpdateUserInfoRes>('/api/user/info/update', cleanedData);
}

// 更新用户密码
export type UpdateUserPasswordReq = {
  current: string;
  new: string;
  confirm?: string; // confirm === new 前端检查即可
};
export type UpdateUserPasswordRes = Pick<UserState, 'username'>;

export function updateUserPassword(data: UpdateUserPasswordReq) {
  return axios.post<UpdateUserPasswordRes>('/api/user/reset-password', data);
}
