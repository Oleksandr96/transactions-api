import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/modules/user/user.entity';
import { TransactionEntity } from '@app/modules/transactions/transaction.entity';
import { TransactionsController } from '@app/modules/transactions/transactions.controller';
import { TransactionsService } from '@app/modules/transactions/transactions.service';
import { FilesService } from '@app/modules/files/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TransactionEntity])],
  controllers: [TransactionsController],
  providers: [TransactionsService, FilesService],
})
export class TransactionsModule {}
