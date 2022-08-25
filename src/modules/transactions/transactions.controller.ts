import {
  Controller,
  Get,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@app/modules/user/guards/auth.guard';
import { User } from '@app/modules/user/decorators/user.decorator';
import { TransactionsService } from '@app/modules/transactions/transactions.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '@app/modules/files/files.service';
import { TransactionsReportInterface } from '@app/modules/transactions/types/transactionsReport.interface';
import { TransactionEntity } from '@app/modules/transactions/transaction.entity';
import { CreateTransactionDto } from '@app/modules/transactions/dto/createTransaction.dto';
import { UserType } from '@app/modules/user/types/user.type';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getByUserId(
    @User('id') currentUserId: number,
  ): Promise<TransactionEntity[]> {
    return await this.transactionsService.getByUserId(currentUserId);
  }

  @Get('report')
  @UseGuards(AuthGuard)
  async getReport(): Promise<TransactionsReportInterface[]> {
    return await this.transactionsService.getReport();
  }

  @Post('import')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @User() currentUser: UserType,
  ) {
    const importFile = await this.filesService.saveFiles(file, currentUser.id);
    this.filesService
      .readCSV(importFile.url)
      .on('data', (transaction: CreateTransactionDto) => {
        this.transactionsService.saveTransaction(transaction, currentUser);
      });
  }
}
