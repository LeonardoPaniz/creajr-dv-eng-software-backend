import { Injectable } from '@nestjs/common';
import { AppDataBase } from "../db";
import { State } from "../models/state";

@Injectable()
export class StateRepository {
  private repository = AppDataBase.getRepository(State);

  async findAll() {
    return this.repository.find({ relations: ["cities"] });
  }

  async findById(id: string) {
    return this.repository.findOne({ where: { id }, relations: ["cities"] });
  }

  async findByUf(uf: string) {
    return this.repository.findOne({ where: { uf }, relations: ["cities"] });
  }
}
