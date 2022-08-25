export interface TransactionsReportInterface {
  source: string;
  data: TransactionReportItem[];
}

interface TransactionReportItem {
  date: Date;
  total: number;
}
