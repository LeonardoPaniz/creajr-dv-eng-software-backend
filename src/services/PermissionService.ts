import { Injectable } from "@nestjs/common";
import { PermissionRepository } from "../repositories/PermissionRepository";

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async findAll() {
    return this.permissionRepository.findAll();
  }

  async findById(id: string) {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) throw new Error("Permissão não encontrada");
    return permission;
  }

  async findByResource(resource: string) {
    return this.permissionRepository.findByResource(resource);
  }

  async create(data: { name: string; description?: string; resource: string; action: string }) {
    return this.permissionRepository.create(data);
  }

  async update(id: string, data: { name?: string; description?: string; resource?: string; action?: string }) {
    return this.permissionRepository.update(id, data);
  }

  async delete(id: string) {
    return this.permissionRepository.delete(id);
  }
}
