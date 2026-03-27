import { Module } from '@nestjs/common';
import { MemberModule } from './member.module';
import { AuthModule } from './auth.module';
import { AcademicModule } from './academic.module';
import { CarModule } from './car.module';
import { RoleModule } from './role.module';

@Module({
  imports: [MemberModule, AuthModule, AcademicModule, CarModule, RoleModule],
})
export class AppModule {}
