# NestJS Wallet Service

A production-ready wallet service built with NestJS, TypeScript, and in-memory storage.

## Features

- ✅ Create wallets with default balance of 0
- ✅ Fund wallets with positive amounts
- ✅ Transfer funds between wallets with balance validation
- ✅ Transaction history tracking
- ✅ Comprehensive error handling
- ✅ Input validation using class-validator
- ✅ Unit tests with Jest
- ✅ Clean architecture

## Architecture

```
src/
├── wallets/
│   ├── entities/
│   │   ├── wallet.entity.ts
│   │   └── transaction.entity.ts
│   ├── dto/
│   │   └── wallet.dto.ts
│   ├── wallets.controller.ts
│   ├── wallets.service.ts
│   └── wallets.module.ts
├── app.module.ts
└── main.ts
```

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run start:dev
```

Server will run on `http://localhost:3000`

### Run Tests
```bash
npm test
npm test:cov  # with coverage
```

### Build for Production
```bash
npm run build
npm run start:prod
```

## Error Handling

The service throws meaningful NestJS exceptions:

<!-- | Error | Status | Reason |
|-------|--------|--------|
| `BadRequestException` | 400 | Invalid input (negative amount, self-transfer, insufficient balance) |
| `NotFoundException` | 404 | Wallet not found | -->

Example error response:
```json
{
  "statusCode": 400,
  "message": "Insufficient balance. Available: 50, Requested: 100",
  "error": "Bad Request"
}
```
<!-- 
## Design Decisions

### In-Memory Storage
- **Current Implementation:** Maps for wallets and transactions
- **Trade-offs:** Fast, simple, perfect for development/testing
- **Production Considerations:**
  - Data loss on restart
  - Single-threaded limitations
  - Not suitable for distributed systems

### Production Scaling Strategy

To scale this service for production:

1. **Database Layer**
   - Replace Maps with PostgreSQL or MongoDB
   - Use transactions for ACID compliance
   - Add indexes on wallet ID and timestamps

2. **Concurrency**
   - Implement optimistic locking for balance updates
   - Use database constraints to prevent race conditions
   - Consider event sourcing for audit trails

3. **Microservices**
   - Separate wallet and transaction services
   - Implement CQRS for read/write separation
   - Use message queues (RabbitMQ) for async operations

4. **Caching**
   - Cache frequently accessed wallets in Redis
   - Implement cache invalidation strategy
   - Monitor cache hit rates

5. **Monitoring & Logging**
   - Add structured logging (Winston/Bunyan)
   - Implement distributed tracing (Jaeger)
   - Monitor transaction failures and reconciliation

6. **API Security**
   - Implement JWT authentication
   - Add rate limiting
   - Use HTTPS/TLS
   - Implement API versioning

## Business Logic Highlights

### Balance Integrity
- Validation before every transfer
- Atomic operations (both sides updated together)
- Transaction history for reconciliation

### Transaction History
- All wallet operations recorded
- Includes sender, receiver, amount, timestamp
- Enables audit trails and dispute resolution

### Error Messages
- Clear, actionable error messages
- Helps clients understand what went wrong
- Includes context (available balance, required amount)

## Testing

The service includes comprehensive unit tests covering:
- Wallet creation
- Funding with validation
- Transfer with balance checks
- Transaction history tracking
- Error cases -->

Run tests:
```bash
npm test                # Run all tests
npm test:watch        # Watch mode
npm test:cov          # With coverage report
```

## Future Enhancements

- [ ] Add pagination for transaction history
- [ ] Implement wallet freezing/locking
- [ ] Add transaction reversal/refund logic
- [ ] Multi-currency support with exchange rates
- [ ] Webhook notifications for transfers
- [ ] Rate limiting by user/IP
- [ ] Comprehensive audit logging
- [ ] Integration tests with database
