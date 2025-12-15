import { IsPositive, IsNotEmpty } from 'class-validator';


export class CreateWalletDto {
  @IsNotEmpty()
  currency: 'USD' = 'USD';
}


export class FundWalletDto {
  @IsPositive({ message: 'Amount must be a positive number' })
  amount: number;
}

export class TransferFundsDto {
  @IsNotEmpty({ message: 'Sender wallet ID is required' })
  fromWalletId: string;

  @IsNotEmpty({ message: 'Receiver wallet ID is required' })
  toWalletId: string;

  @IsPositive({ message: 'Amount must be a positive number' })
  amount: number;
}


export class WalletResponseDto {
  id: string;
  currency: 'USD';
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export class TransactionResponseDto {
  id: string;
  type: 'FUND' | 'TRANSFER';
  amount: number;
  fromWalletId?: string;
  toWalletId?: string;
  createdAt: Date;
}


export class WalletDetailsDto extends WalletResponseDto {
  transactions: TransactionResponseDto[];
}
