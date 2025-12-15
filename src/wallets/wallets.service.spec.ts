import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './wallets.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('WalletsService', () => {
  let service: WalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletsService],
    }).compile();

    service = module.get<WalletsService>(WalletsService);
  });

  describe('createWallet', () => {
    it('should create a wallet with default balance 0', () => {
      const wallet = service.createWallet({ currency: 'USD' });
      expect(wallet).toBeDefined();
      expect(wallet.balance).toBe(0);
      expect(wallet.currency).toBe('USD');
    });
  });

  describe('fundWallet', () => {
    it('should increase wallet balance', () => {
      const wallet = service.createWallet({ currency: 'USD' });
      const funded = service.fundWallet(wallet.id, { amount: 100 });
      expect(funded.balance).toBe(100);
    });

    it('should throw error for negative amount', () => {
      const wallet = service.createWallet({ currency: 'USD' });
      expect(() => service.fundWallet(wallet.id, { amount: -10 })).toThrow(
        BadRequestException,
      );
    });

    it('should throw error for non-existent wallet', () => {
      expect(() => service.fundWallet('non-existent-id', { amount: 50 })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('transferFunds', () => {
    it('should transfer funds between wallets', () => {
      const sender = service.createWallet({ currency: 'USD' });
      const receiver = service.createWallet({ currency: 'USD' });

      // Fund sender
      service.fundWallet(sender.id, { amount: 100 });

      // Transfer
      const result = service.transferFunds({
        fromWalletId: sender.id,
        toWalletId: receiver.id,
        amount: 50,
      });

      expect(result.balance).toBe(50); // Sender's balance after transfer
      const receiverDetails = service.getWalletDetails(receiver.id);
      expect(receiverDetails.balance).toBe(50);
    });

    it('should throw error if sender has insufficient balance', () => {
      const sender = service.createWallet({ currency: 'USD' });
      const receiver = service.createWallet({ currency: 'USD' });

      service.fundWallet(sender.id, { amount: 30 });

      expect(() =>
        service.transferFunds({
          fromWalletId: sender.id,
          toWalletId: receiver.id,
          amount: 50,
        }),
      ).toThrow(BadRequestException);
    });

    it('should throw error for self-transfer', () => {
      const wallet = service.createWallet({ currency: 'USD' });

      expect(() =>
        service.transferFunds({
          fromWalletId: wallet.id,
          toWalletId: wallet.id,
          amount: 50,
        }),
      ).toThrow(BadRequestException);
    });

    it('should record transaction history', () => {
      const sender = service.createWallet({ currency: 'USD' });
      const receiver = service.createWallet({ currency: 'USD' });

      service.fundWallet(sender.id, { amount: 100 });
      service.transferFunds({
        fromWalletId: sender.id,
        toWalletId: receiver.id,
        amount: 50,
      });

      const details = service.getWalletDetails(sender.id);
      expect(details.transactions.length).toBe(2); // 1 fund + 1 transfer
      expect(details.transactions[0].type).toBe('FUND');
      expect(details.transactions[1].type).toBe('TRANSFER');
    });
  });

  describe('getWalletDetails', () => {
    it('should return wallet details with transactions', () => {
      const wallet = service.createWallet({ currency: 'USD' });
      service.fundWallet(wallet.id, { amount: 100 });

      const details = service.getWalletDetails(wallet.id);
      expect(details.balance).toBe(100);
      expect(details.transactions.length).toBe(1);
    });

    it('should throw error for non-existent wallet', () => {
      expect(() => service.getWalletDetails('non-existent-id')).toThrow(
        NotFoundException,
      );
    });
  });
});
