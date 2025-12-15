/**
 * Wallet Entity
 * Represents a user's wallet with a balance in a specific currency
 */
export class Wallet {
  id: string;
  currency: 'USD';
  balance: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, currency: 'USD' = 'USD', balance: number = 0) {
    this.id = id;
    this.currency = currency;
    this.balance = balance;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
