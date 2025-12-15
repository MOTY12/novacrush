import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import {
  CreateWalletDto,
  FundWalletDto,
  TransferFundsDto,
  WalletResponseDto,
  WalletDetailsDto,
} from './dto/wallet.dto';

/**
 * Wallets Controller
 * Handles HTTP endpoints for wallet operations
 */
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  /**
   * POST /wallets
   * Create a new wallet with default balance = 0
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createWallet(
    @Body(ValidationPipe) createWalletDto: CreateWalletDto,
  ): WalletResponseDto {
    return this.walletsService.createWallet(createWalletDto);
  }

  /**
   * POST /wallets/:id/fund
   * Fund a wallet with a positive amount
   */
  @Post(':id/fund')
  @HttpCode(HttpStatus.OK)
  fundWallet(
    @Param('id') walletId: string,
    @Body(ValidationPipe) fundWalletDto: FundWalletDto,
  ): WalletResponseDto {
    return this.walletsService.fundWallet(walletId, fundWalletDto);
  }

  /**
   * POST /wallets/transfer
   * Transfer funds from one wallet to another
   */
  @Post('transfer')
  @HttpCode(HttpStatus.OK)
  transferFunds(
    @Body(ValidationPipe) transferFundsDto: TransferFundsDto,
  ): WalletDetailsDto {
    return this.walletsService.transferFunds(transferFundsDto);
  }

  /**
   * GET /wallets/:id
   * Get wallet details with transaction history
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getWalletDetails(@Param('id') walletId: string): WalletDetailsDto {
    return this.walletsService.getWalletDetails(walletId);
  }

  /**
   * GET /wallets
   * Get all wallets (admin/debugging)
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  getAllWallets(): WalletResponseDto[] {
    return this.walletsService.getAllWallets();
  }
}
