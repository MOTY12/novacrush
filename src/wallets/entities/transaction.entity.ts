/**
 * Transaction Entity
 * Records fund deposits and transfers between wallets
 */
export class Transaction {
  id: string;
  type: 'FUND' | 'TRANSFER';
  amount: number;
  fromWalletId?: string;
  toWalletId?: string;
  createdAt: Date;

  constructor(
    id: string,
    type: 'FUND' | 'TRANSFER',
    amount: number,
    toWalletId: string,
    fromWalletId?: string,
  ) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.fromWalletId = fromWalletId;
    this.toWalletId = toWalletId;
    this.createdAt = new Date();
  }
}
