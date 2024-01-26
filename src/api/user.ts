import axios from 'axios';
import { UserState } from '@/store/modules/user/types';
import type { RouteRecordNormalized } from 'vue-router';
import { RSH_TOKEN_KEY, getToken } from '@/utils/auth';

// 登录
export interface LoginData {
  username: string;
  password: string;
}
export interface LoginRes {
  access_token: string;
  refresh_token: string;
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/user/login', {
    ...data,
    account: data.username,
  });
}

// 刷新 Access Token
export type RefreshRes = Pick<LoginRes, 'access_token'>;

export function refreshToken() {
  const token = getToken(RSH_TOKEN_KEY);
  return axios.get<RefreshRes>('/api/user/refresh', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 获取用户信息
export function getUserInfo() {
  return axios.get<UserState>('/api/user/info');
}

// 更新用户信息（除密码）
export type BasicInformationModel = Pick<
  UserState,
  'nickname' | 'phone' | 'email' | 'sector' | 'job' | 'location'
>;
export type UpdateUserInfoParams = BasicInformationModel;
export type UpdateUserInfoRes = Pick<UserState, 'id'>;
export function updateUserInfo(data: UpdateUserInfoParams) {
  return axios.put<UpdateUserInfoRes>('/api/user/info/update', data);
}

// 获取用户菜单（后端控制权限，返回用户可达页面）
export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

// 更新用户密码
export interface UserPasswordModel {
  current: string;
  new: string;
  confirm: string;
}
export type UpdateUserPasswordParams = UserPasswordModel;
export type UpdateUserPasswordRes = Pick<UserState, 'id'>;

export function updateUserPassword(data: UpdateUserPasswordParams) {
  return axios.post<UpdateUserPasswordRes>('/api/user/reset-password', data);
}

export interface EnterpriseCertificationModel {
  status: number;
  time: string;
  legalPerson: string;
  certificateType: string;
  authenticationNumber: string;
  enterpriseName: string;
  enterpriseCertificateType: string;
  organizationCode: string;
}

export type CertificationRecord = Array<{
  certificationType: number;
  certificationContent: string;
  status: number;
  time: string;
}>;

export interface UnitCertification {
  enterpriseInfo: EnterpriseCertificationModel;
  record: CertificationRecord;
}

export function queryCertification() {
  return axios.post<UnitCertification>('/api/user/certification');
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
