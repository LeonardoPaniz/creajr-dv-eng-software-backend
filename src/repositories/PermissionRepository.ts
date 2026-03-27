import { Injectable } from '@nestjs/common';
import { AppDataBase } from "../db";
import { Permission } from "../models/permission";

@Injectable()
export class PermissionRepository {
  private repository = AppDataBase.getRepository(Permission);

  async findAll() {
    return this.repository.find();
  }

  async findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async findByResource(resource: string) {
    return this.repository.find({ where: { resource } });
  }

  async create(data: Partial<Permission>) {
    const permission = this.repository.create(data);
    return this.repository.save(permission);
  }

  async update(id: string, data: Partial<Permission>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string) {
    await this.repository.delete(id);
  }
}
