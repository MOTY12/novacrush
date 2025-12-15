import { IsPositive, IsNotEmpty } from 'class-validator';

/**
 * DTO for creating a new wallet
 */
export class CreateWalletDto {
  @IsNotEmpty()
  currency: 'USD' = 'USD';
}

/**
 * DTO for funding a wallet
 */
export class FundWalletDto {
  @IsPositive({ message: 'Amount must be a positive number' })
  amount: number;
}

/**
 * DTO for transferring funds between wallets
 */
export class TransferFundsDto {
  @IsNotEmpty({ message: 'Sender wallet ID is required' })
  fromWalletId: string;

  @IsNotEmpty({ message: 'Receiver wallet ID is required' })
  toWalletId: string;

  @IsPositive({ message: 'Amount must be a positive number' })
  amount: number;
}

/**
 * DTO for wallet response
 */
export class WalletResponseDto {
  id: string;
  currency: 'USD';
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for transaction response
 */
export class TransactionResponseDto {
  id: string;
  type: 'FUND' | 'TRANSFER';
  amount: number;
  fromWalletId?: string;
  toWalletId?: string;
  createdAt: Date;
}

/**
 * DTO for wallet details with transaction history
 */
export class WalletDetailsDto extends WalletResponseDto {
  transactions: TransactionResponseDto[];
}
