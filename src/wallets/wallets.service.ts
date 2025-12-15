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

/**
 * Wallet Service
 *
 * Manages wallet operations and transactions with in-memory storage.
 * This approach is suitable for development and testing. For production,
 * consider replacing Maps with a database solution like PostgreSQL or MongoDB
 * to ensure data persistence and enable horizontal scaling.
 */
@Injectable()
export class WalletsService {
  // In-memory storage for wallets and transactions
  private wallets: Map<string, Wallet> = new Map();
  private transactions: Map<string, Transaction[]> = new Map();

  /**
   * Create a new wallet with default balance of 0
   */
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

  /**
   * Fund a wallet with a positive amount
   * Creates a FUND type transaction
   */
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

  /**
   * Transfer funds from one wallet to another
   * Validates sender and receiver, prevents negative balance
   */
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

    // Check sufficient balance (critical for financial integrity)
    if (fromWallet.balance < amount) {
      throw new BadRequestException(
        `Insufficient balance. Available: ${fromWallet.balance}, Requested: ${amount}`,
      );
    }

    // Execute transfer (atomic operation)
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

  /**
   * Get wallet details with full transaction history
   */
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

  /**
   * Get all wallets (useful for debugging/admin)
   */
  getAllWallets(): WalletResponseDto[] {
    return Array.from(this.wallets.values()).map((wallet) =>
      this.mapWalletToDto(wallet),
    );
  }

  /**
   * Helper: Validate wallet exists, throw 404 if not
   */
  private validateWalletExists(walletId: string): Wallet {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID "${walletId}" not found`);
    }
    return wallet;
  }

  /**
   * Helper: Map Wallet entity to DTO
   */
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
