// eslint-disable-next-line no-shadow
export enum USERROLE {
  ADMIN = 'admin',
  USER = 'user',
}

export interface UserState {
  username?: string;
  role?: USERROLE.ADMIN;

  password?: string;

  email?: string;
  phone?: string;
  sector?: string;

  accessToken?: string;
  refreshToken?: string;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export {};
