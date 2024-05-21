import type { RouteRecordNormalized } from 'vue-router';
import axios from 'axios';
import { UserState } from '@/store/modules/user/types';

// 登录
export interface LoginParams {
  username: string;
  password: string;
}
export interface LoginRes {
  accessToken: string;
  refreshToken: string;
}

export function login(data: LoginParams) {
  // 有时候前端的有些字段和后端接口不一致
  // 为了避免大面积修改变量，可以只在接口这里做一下映射处理
  // const cleanedData = { ...data, xxx: '' }
  return axios.post<LoginRes>('/api/user/login', data);
}

// 刷新令牌
export type UpdateRefreshTokenParams = Pick<LoginRes, 'refreshToken'>;
export type UpdateRefreshTokenRes = Pick<LoginRes, 'accessToken'>;

export function updateUserToken(params: UpdateRefreshTokenParams) {
  return axios.get<UpdateRefreshTokenRes>('/api/user/refresh', {
    headers: {
      Authorization: `Bearer ${params.refreshToken}`,
    },
  });
}

// 获取用户信息
export type QueryUserInfoRes = Omit<
  UserState,
  'password' | 'accessToken' | 'refreshToken'
>;

export function queryUserInfo() {
  return axios.get<QueryUserInfoRes>('/api/user/info');
}

// 更新用户信息（除密码）
export type UpdateUserInfoParams = Omit<
  UserState,
  'password' | 'accessToken' | 'refreshToken'
>;
export type UpdateUserInfoRes = Pick<UserState, 'username'>;

export function updateUserInfo(data: UpdateUserInfoParams) {
  return axios.put<UpdateUserInfoRes>('/api/user/info/update', data);
}

// 获取用户菜单（后端控制权限，返回用户可达页面）
export function queryUserMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

// 更新用户密码
export interface UpdateUserPasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}
export type UpdateUserPasswordRes = Pick<UserState, 'username'>;

export function updateUserPassword(data: UpdateUserPasswordParams) {
  return axios.post<UpdateUserPasswordRes>('/api/user/password/update', data);
}

export function userUploadApi(
  data: FormData,
  config: {
    controller: AbortController;
    onUploadProgress?: (progressEvent: any) => void;
  }
) {
  // const controller = new AbortController();
  return axios.post('/api/user/upload', data, config);
}
