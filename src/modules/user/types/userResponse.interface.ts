import { UserType } from '@app/modules/user/types/user.type';

export interface UserResponseInterface {
  user: UserType & { token: string };
}
