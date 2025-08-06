import { UserModel } from '@/api/user';
import { UserTokenModel } from '@/api/account';

export interface UserState
  extends Partial<UserModel>,
    Partial<UserTokenModel> {}
