import { Injectable } from '@nestjs/common';
import { AppDataBase } from "../db";
import { Car } from "../models/car";

@Injectable()
export class CarRepository {
  private repository = AppDataBase.getRepository(Car);

  async findAll() {
    return this.repository.find({ relations: ["cities", "cities.state", "managers"] });
  }

  async findById(id: string) {
    return this.repository.findOne({ 
      where: { id }, 
      relations: ["cities", "cities.state", "managers"] 
    });
  }

  async create(data: Partial<Car>) {
    const car = this.repository.create(data);
    return this.repository.save(car);
  }

  async update(id: string, data: Partial<Car>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async addManager(carId: string, memberId: string) {
    const car = await this.findById(carId);
    if (!car) throw new Error("CAR não encontrada");
    
    await AppDataBase.query(
      `INSERT INTO car_managers (car_id, member_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [carId, memberId]
    );
    
    return this.findById(carId);
  }

  async removeManager(carId: string, memberId: string) {
    await AppDataBase.query(
      `DELETE FROM car_managers WHERE car_id = $1 AND member_id = $2`,
      [carId, memberId]
    );
  }

  async addCities(carId: string, cityIds: string[]) {
    const values = cityIds.map(cityId => `('${carId}', '${cityId}')`).join(',');
    await AppDataBase.query(
      `INSERT INTO car_cities (car_id, city_id) VALUES ${values} ON CONFLICT DO NOTHING`
    );
    return this.findById(carId);
  }

  async removeCities(carId: string, cityIds: string[]) {
    await AppDataBase.query(
      `DELETE FROM car_cities WHERE car_id = $1 AND city_id = ANY($2)`,
      [carId, cityIds]
    );
  }
}
