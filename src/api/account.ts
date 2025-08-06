import type { RouteRecordNormalized } from 'vue-router';
import axios, { AxiosRequestConfig } from 'axios';
import qs from 'query-string';
import { UserModel } from './user';
import { List, Pagination } from '@/global';
import { SOURCEAGENT } from './enum';

/**
 * 用户令牌信息
 */
export interface UserTokenModel {
  accessToken: string;
  refreshToken: string;
}

// 登录
export type LoginReq = Pick<UserModel, 'username' | 'password'>;

export type LoginRes = UserTokenModel;

export function login(data: LoginReq) {
  // 有时候前端的有些字段和后端接口不一致
  // 为了避免大面积修改变量，可以只在接口这里做一下映射处理
  const cleanedData = { ...data, account: data.username };
  return axios.post<LoginRes>('/api/user/login', cleanedData);
}

// 刷新令牌
export type UpdateRefreshTokenReq = Pick<UserTokenModel, 'refreshToken'>;

export type UpdateRefreshTokenRes = Pick<UserTokenModel, 'accessToken'>;

export function updateUserToken(data: UpdateRefreshTokenReq) {
  return axios.get<UpdateRefreshTokenRes>('/api/user/token/refresh', {
    headers: {
      Authorization: `Bearer ${data.refreshToken}`,
    },
  });
}

// 登录用户获取个人信息
export type QueryUserInfoRes = Omit<
  UserModel,
  'password' | 'accessToken' | 'refreshToken'
>;

export function queryUserInfo() {
  return axios.get<QueryUserInfoRes>('/api/user/info');
}

// 获取用户菜单（由后端完全控制登录用户路由权限）
export function queryServerMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

// 登录用户更新个人信息（用户名、昵称、手机号、邮箱）
export type UpdateUserInfoReq = Pick<
  UserModel,
  'username' | 'nickname' | 'phone' | 'email'
>;
export type UpdateUserInfoRes = Omit<UserModel, 'password'>;

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

// 登录用户更新个人照片，传输文件需要使用 FormData 类型
export type UpdateUserAvatarReq = FormData;
export type UpdateUserAvatarRes = Pick<UserModel, 'avatar'>;

export function updateUserAvatar(
  data: UpdateUserAvatarReq,
  config?: AxiosRequestConfig,
) {
  return axios.patch<UpdateUserAvatarRes>(
    '/api/user/avatar/update',
    data,
    config,
  );
}

// 登录用户更新个人密码
export type UpdateUserPasswordReq = {
  current: string;
  new: string;
  confirm?: string; // confirm === new 前端检查即可
};
export type UpdateUserPasswordRes = Pick<UserModel, 'id' | 'username'>;

export function updateUserPassword(data: UpdateUserPasswordReq) {
  return axios.patch<UpdateUserPasswordRes>('/api/user/password/update', data);
}

// 登录日志结果
export enum LOGINRESULT {
  SUCCESS = 'success',
  FAILURE = 'failure',
  FAULT = 'fault',
}

// 登录日志模型
export interface UserLoginLogModel {
  id: number;
  userId: string; // 关联 UserModel.id

  result: LOGINRESULT;

  bioResult?: LOGINRESULT; // 保留字段，生物识别结果
  bioConfidence?: number; // 保留字段，生物识别结果可信度

  mfaResult?: LOGINRESULT; // 保留字段，多因素认证结果

  statusCode: number;
  errorMessage: string;

  sourceAgent: SOURCEAGENT;
  sourceIp: string;
  sourceFp: string;

  createdAt: string;
}

// 登录用户获取个人登录日志
export interface QueryUserLoginLogReq {
  dateRange?: string[];
}
export type QueryUserLoginLogRes = List<UserLoginLogModel>;

export function queryUserLoginLog(params: QueryUserLoginLogReq & Pagination) {
  const { current, pageSize, ...data } = params;
  return axios.post<QueryUserLoginLogRes>('/api/user/log/login', data, {
    params: {
      current,
      pageSize,
    },
    paramsSerializer: (obj: Record<string, any>) => {
      return qs.stringify(obj);
    },
  });
}
