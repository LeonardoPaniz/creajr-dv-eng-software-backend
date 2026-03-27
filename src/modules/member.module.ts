import { Module } from '@nestjs/common';
import { MemberController } from '../controllers/MembersController';
import { MemberService } from '../services/MemberService';
import { MemberRepository } from '../repositories/MemberRepository';

@Module({
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
  exports: [MemberService],
})
export class MemberModule {}
