import { UserType } from '@app/modules/user/types/user.type';

export class CreateTransactionDto {
  date: Date;
  readonly sum: number;
  readonly source: string;
  readonly description: string;
  user: UserType;
}
