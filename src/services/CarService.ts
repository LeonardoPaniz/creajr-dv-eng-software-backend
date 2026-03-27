import { Injectable } from "@nestjs/common";
import { CarRepository } from "../repositories/CarRepository";
import { MemberRepository } from "../repositories/MemberRepository";
import { AppDataBase } from "../db";
import { Member } from "../models/member";

@Injectable()
export class CarService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  async getMembersByCar(carId: string) {
    const car = await this.carRepository.findById(carId);
    if (!car) throw new Error("CAR não encontrada");

    const cityIds = car.cities.map(city => city.id);
    
    const members = await AppDataBase.getRepository(Member)
      .createQueryBuilder("member")
      .leftJoinAndSelect("member.city", "city")
      .leftJoinAndSelect("member.memberCourses", "memberCourses")
      .leftJoinAndSelect("memberCourses.courseUniversity", "courseUniversity")
      .leftJoinAndSelect("courseUniversity.course", "course")
      .leftJoinAndSelect("courseUniversity.university", "university")
      .where("member.city_id IN (:...cityIds)", { cityIds })
      .getMany();

    return members;
  }

  async getCarsForMember(memberId: string) {
    const member = await this.memberRepository.findById(memberId);
    if (!member) throw new Error("Membro não encontrado");

    const cars = await AppDataBase.getRepository(Member)
      .createQueryBuilder("member")
      .leftJoin("member.city", "city")
      .leftJoin("car_cities", "cc", "cc.city_id = city.id")
      .leftJoin("cars", "car", "car.id = cc.car_id")
      .where("member.id = :memberId", { memberId })
      .select(["car.*"])
      .getRawMany();

    return cars;
  }

  async assignManagerToCar(carId: string, memberId: string) {
    return this.carRepository.addManager(carId, memberId);
  }

  async removeManagerFromCar(carId: string, memberId: string) {
    return this.carRepository.removeManager(carId, memberId);
  }

  async assignCitiesToCar(carId: string, cityIds: string[]) {
    return this.carRepository.addCities(carId, cityIds);
  }

  async removeCitiesFromCar(carId: string, cityIds: string[]) {
    return this.carRepository.removeCities(carId, cityIds);
  }

  async create(data: { name: string; description?: string }) {
    return this.carRepository.create(data);
  }

  async findAll() {
    return this.carRepository.findAll();
  }

  async findById(id: string) {
    return this.carRepository.findById(id);
  }
}
