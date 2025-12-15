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


@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}


  @Post()
  @HttpCode(HttpStatus.CREATED)
  createWallet(
    @Body(ValidationPipe) createWalletDto: CreateWalletDto,
  ): WalletResponseDto {
    return this.walletsService.createWallet(createWalletDto);
  }


  @Post(':id/fund')
  @HttpCode(HttpStatus.OK)
  fundWallet(
    @Param('id') walletId: string,
    @Body(ValidationPipe) fundWalletDto: FundWalletDto,
  ): WalletResponseDto {
    return this.walletsService.fundWallet(walletId, fundWalletDto);
  }

  @Post('transfer')
  @HttpCode(HttpStatus.OK)
  transferFunds(
    @Body(ValidationPipe) transferFundsDto: TransferFundsDto,
  ): WalletDetailsDto {
    return this.walletsService.transferFunds(transferFundsDto);
  }


  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getWalletDetails(@Param('id') walletId: string): WalletDetailsDto {
    return this.walletsService.getWalletDetails(walletId);
  }


  @Get()
  @HttpCode(HttpStatus.OK)
  getAllWallets(): WalletResponseDto[] {
    return this.walletsService.getAllWallets();
  }
}
