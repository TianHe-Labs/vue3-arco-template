import axios from 'axios';
import qs from 'query-string';
import { List, Pagination } from '@/global';

// 消息类型，通知、告警
export type MessageType = 'notice' | 'alert';

// 消息模型
export interface MessageModel {
  id: string;
  title: string;
  content: any;
  type: MessageType;
  readAt?: string | Date; // 阅读时间，同时可以用来标识是否已读，不再额外增加字段
  createdAt: string | Date; // 创建时间，代表消息的生成时间
  updatedAt: string | Date; // 更新时间
}

// 获取消息列表，时间倒序，最新的在前
export interface QueryMessageListReq {
  type?: MessageType; // 消息类型，通知、告警
  unread?: boolean; // 是否只查询未读消息
}
export type QueryMessageListRes = List<MessageModel>;

export function queryMessageList(params: QueryMessageListReq & Pagination) {
  const { current, pageSize, ...data } = params;
  return axios.post<QueryMessageListRes>('/api/message/list', data, {
    params: {
      current,
      pageSize,
    },
    paramsSerializer: (obj: Record<string, any>) => {
      return qs.stringify(obj);
    },
  });
}

// 统计
export interface QueryMessageStatReq {
  unread?: boolean; // 是否只统计未读消息
}
export type QueryMessageStatRes = { total: number } & {
  [key in MessageType]: number; // 按类型统计
};
export function queryMessageStat(params: QueryMessageStatReq) {
  return axios.get<QueryMessageStatRes>('/api/message/stat', { params });
}

// 标记已读，单批量
export interface UpdateMessageReadAtReq {
  ids?: string[]; // 不传则全部标记
}
export interface UpdateMessageReadAtRes {
  ids: string[]; // 标记成功的id
  readAt: string | Date; // 标记成功的最新时间
}
export function updateMessageReadAt(data: UpdateMessageReadAtReq) {
  return axios.put<UpdateMessageReadAtRes>('/api/message/readAt', data);
}

// 删除消息，单批量
export interface DeleteMessageReq {
  ids?: string[]; // 不传则全部删除
}
export interface DeleteMessageRes {
  ids: string[]; // 删除成功的id
}
export function deleteMessage(data: DeleteMessageReq) {
  return axios.delete<DeleteMessageRes>('/api/message', { data });
}
