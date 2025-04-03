import axios from 'axios';

// 通知、告警、待办
export type MessageType = 'notice' | 'alert';

export interface MessageRecord {
  id: string;
  title: string;
  subTitle?: string;
  avatar?: string;
  content: string;
  type: MessageType;
  readAt?: string | Date; // 阅读时间，同时可以用来标识是否已读，不再额外增加字段
  createdAt: string | Date;
  updatedAt: string | Date;
}
export type MessageListType = MessageRecord[];

// 获取最新未读消息列表
export interface QueryMessageListRes {
  list: MessageRecord[];
}

export function queryMessageList() {
  return axios.post<QueryMessageListRes>('/api/message/list');
}

// 标记已读，单个、批量二合一
export type UpdateMessageStatusReq = {
  ids: string[];
};

export function updateMessageStatus(data: UpdateMessageStatusReq) {
  return axios.put('/api/message/read', data);
}
