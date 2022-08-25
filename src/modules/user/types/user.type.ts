import { UserEntity } from '@app/modules/user/user.entity';

export type UserType = Omit<UserEntity, 'hashPassword'>;
