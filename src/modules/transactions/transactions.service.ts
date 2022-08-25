import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '@app/modules/transactions/transaction.entity';
import { TransactionsReportInterface } from '@app/modules/transactions/types/transactionsReport.interface';
import { CreateTransactionDto } from '@app/modules/transactions/dto/createTransaction.dto';
import { UserType } from '@app/modules/user/types/user.type';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionsRepository: Repository<TransactionEntity>,
  ) {}

  async getByUserId(currentUserId: number): Promise<TransactionEntity[]> {
    return await this.transactionsRepository.find({
      where: `userId=${currentUserId}`,
    });
  }

  async getReport(): Promise<TransactionsReportInterface[]> {
    const data = await this.transactionsRepository
      .createQueryBuilder()
      .select([
        'DATE_FORMAT(date, "%m-%Y") as date',
        'SUM(sum) as total',
        'source',
      ])
      .groupBy('YEAR(date), MONTH(date), source')
      .execute();

    const sourceMap = data.reduce(
      (acc, { source, ...rest }) => ({
        ...acc,
        [source]: acc[source] ? [...acc[source], { ...rest }] : [{ ...rest }],
      }),
      {},
    );

    return Object.keys(sourceMap).map((k) => ({
      source: k,
      data: sourceMap[k],
    }));
  }

  saveTransaction(transaction: CreateTransactionDto, user: UserType): void {
    transaction.user = user;
    transaction.date = this.parseDate(transaction.date.toString());
    this.transactionsRepository.save(transaction);
  }

  parseDate(date: string): Date {
    const [day, month, year] = date.toString().split('-');
    return new Date(+year, +month - 1, +day);
  }
}
