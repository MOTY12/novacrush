import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import {
  CreateWalletDto,
  FundWalletDto,
  TransferFundsDto,
  WalletResponseDto,
  WalletDetailsDto,
} from './dto/wallet.dto';


@Injectable()
export class WalletsService {
  // In-memory storage for wallets and transactions
  private wallets: Map<string, Wallet> = new Map();
  private transactions: Map<string, Transaction[]> = new Map();


  createWallet(createWalletDto: CreateWalletDto): WalletResponseDto {
    const walletId = uuidv4();
    const wallet = new Wallet(
      walletId,
      createWalletDto.currency || 'USD',
      0,
    );

    this.wallets.set(walletId, wallet);
    this.transactions.set(walletId, []);

    return this.mapWalletToDto(wallet);
  }


  fundWallet(walletId: string, fundWalletDto: FundWalletDto): WalletResponseDto {
    const wallet = this.validateWalletExists(walletId);

    // Validate amount is positive
    if (fundWalletDto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // Update wallet balance
    wallet.balance += fundWalletDto.amount;
    wallet.updatedAt = new Date();

    // Record transaction
    const transaction = new Transaction(
      uuidv4(),
      'FUND',
      fundWalletDto.amount,
      walletId,
    );
    this.transactions.get(walletId).push(transaction);

    return this.mapWalletToDto(wallet);
  }

  transferFunds(transferFundsDto: TransferFundsDto): WalletDetailsDto {
    const { fromWalletId, toWalletId, amount } = transferFundsDto;

    // Validate amount is positive
    if (amount <= 0) {
      throw new BadRequestException('Transfer amount must be greater than 0');
    }

    // Validate sender and receiver exist
    const fromWallet = this.validateWalletExists(fromWalletId);
    const toWallet = this.validateWalletExists(toWalletId);

    // Prevent self-transfer
    if (fromWalletId === toWalletId) {
      throw new BadRequestException(
        'Cannot transfer funds to the same wallet',
      );
    }

    if (fromWallet.balance < amount) {
      throw new BadRequestException(
        `Insufficient balance. Available: ${fromWallet.balance}, Requested: ${amount}`,
      );
    }

    fromWallet.balance -= amount;
    fromWallet.updatedAt = new Date();

    toWallet.balance += amount;
    toWallet.updatedAt = new Date();

    // Record transactions for both wallets
    const transactionId = uuidv4();
    const transaction = new Transaction(
      transactionId,
      'TRANSFER',
      amount,
      toWalletId,
      fromWalletId,
    );

    this.transactions.get(fromWalletId).push(transaction);
    this.transactions.get(toWalletId).push(transaction);

    return this.getWalletDetails(fromWalletId);
  }


  getWalletDetails(walletId: string): WalletDetailsDto {
    const wallet = this.validateWalletExists(walletId);
    const walletTransactions = this.transactions.get(walletId) || [];

    return {
      ...this.mapWalletToDto(wallet),
      transactions: walletTransactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        fromWalletId: t.fromWalletId,
        toWalletId: t.toWalletId,
        createdAt: t.createdAt,
      })),
    };
  }


  getAllWallets(): WalletResponseDto[] {
    return Array.from(this.wallets.values()).map((wallet) =>
      this.mapWalletToDto(wallet),
    );
  }

 
  private validateWalletExists(walletId: string): Wallet {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID "${walletId}" not found`);
    }
    return wallet;
  }

  private mapWalletToDto(wallet: Wallet): WalletResponseDto {
    return {
      id: wallet.id,
      currency: wallet.currency,
      balance: wallet.balance,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    };
  }
}
