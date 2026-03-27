import { Injectable } from "@nestjs/common";
import { RoleRepository } from "../repositories/RoleRepository";

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findAll() {
    return this.roleRepository.findAll();
  }

  async findById(id: string) {
    const role = await this.roleRepository.findById(id);
    if (!role) throw new Error("Role não encontrada");
    return role;
  }

  async findByName(name: string) {
    return this.roleRepository.findByName(name);
  }

  async create(data: { name: string; description?: string }) {
    return this.roleRepository.create(data);
  }

  async update(id: string, data: { name?: string; description?: string }) {
    return this.roleRepository.update(id, data);
  }

  async delete(id: string) {
    return this.roleRepository.delete(id);
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    return this.roleRepository.assignPermissions(roleId, permissionIds);
  }

  async assignToMember(roleId: string, memberId: string) {
    await this.roleRepository.assignRoleToMember(roleId, memberId);
    return { message: "Role atribuída ao membro com sucesso" };
  }

  async removeFromMember(roleId: string, memberId: string) {
    await this.roleRepository.removeRoleFromMember(roleId, memberId);
    return { message: "Role removida do membro com sucesso" };
  }
}
