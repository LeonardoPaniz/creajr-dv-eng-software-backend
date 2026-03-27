import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/authService';
import { MemberRepository } from '../repositories/MemberRepository';
import { TokenRepository } from '../repositories/TokenRepository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MemberRepository, TokenRepository],
  exports: [AuthService],
})
export class AuthModule {}
