import { Module } from '@nestjs/common';
import { WalletsModule } from './wallets/wallets.module';

/**
 * App Module
 * Root module that imports all feature modules
 */
@Module({
  imports: [WalletsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
