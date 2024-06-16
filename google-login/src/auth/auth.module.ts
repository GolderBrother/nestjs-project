import { Module } from '@nestjs/common';
import { GoogleStrategy } from './auth.strategy';

@Module({
  providers: [GoogleStrategy],
})
export class AuthModule {}
