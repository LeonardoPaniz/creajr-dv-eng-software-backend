import { Module } from '@nestjs/common';
import { CarController } from '../controllers/CarController';
import { CarService } from '../services/CarService';
import { CarRepository } from '../repositories/CarRepository';
import { MemberRepository } from '../repositories/MemberRepository';

@Module({
  controllers: [CarController],
  providers: [CarService, CarRepository, MemberRepository],
  exports: [CarService, CarRepository],
})
export class CarModule {}
