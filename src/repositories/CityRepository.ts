import { Injectable } from '@nestjs/common';
import { AppDataBase } from "../db";
import { City } from "../models/city";

@Injectable()
export class CityRepository {
  private repository = AppDataBase.getRepository(City);

  async findAll() {
    return this.repository.find({ relations: ["state"] });
  }

  async findById(id: string) {
    return this.repository.findOne({ where: { id }, relations: ["state"] });
  }

  async findByState(stateId: string) {
    return this.repository.find({ where: { state_id: stateId }, relations: ["state"] });
  }

  async create(data: Partial<City>) {
    const city = this.repository.create(data);
    return this.repository.save(city);
  }
}
