// eslint-disable-next-line no-shadow
export enum RoleEnum {
  superadmin = 'superadmin',
  admin = 'admin',
  common = 'common',
}

export interface UserState {
  id?: string;
  username?: string;
  nickname?: string;
  role?: RoleEnum;

  password?: string;

  email?: string;
  phone?: string;

  avatar?: string;
  sector?: string; // 部门
  job?: string; // 职位、职能
  location?: string; // 办公地点
  certification?: string; // 实名
  lastActiveAt?: string | Date; // 最近活跃于

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
