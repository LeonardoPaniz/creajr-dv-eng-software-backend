import { Injectable } from '@nestjs/common';
import { AppDataBase } from "../db";
import { Role } from "../models/role";

@Injectable()
export class RoleRepository {
  private repository = AppDataBase.getRepository(Role);

  async findAll() {
    return this.repository.find({ relations: ["permissions"] });
  }

  async findById(id: string) {
    return this.repository.findOne({ where: { id }, relations: ["permissions", "members"] });
  }

  async findByName(name: string) {
    return this.repository.findOne({ where: { name }, relations: ["permissions"] });
  }

  async create(data: Partial<Role>) {
    const role = this.repository.create(data);
    return this.repository.save(role);
  }

  async update(id: string, data: Partial<Role>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string) {
    await this.repository.delete(id);
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    await AppDataBase.query(
      `DELETE FROM role_permissions WHERE role_id = $1`,
      [roleId]
    );

    if (permissionIds.length > 0) {
      const values = permissionIds.map(permId => `('${roleId}', '${permId}')`).join(',');
      await AppDataBase.query(
        `INSERT INTO role_permissions (role_id, permission_id) VALUES ${values}`
      );
    }

    return this.findById(roleId);
  }

  async assignRoleToMember(roleId: string, memberId: string) {
    await AppDataBase.query(
      `INSERT INTO member_roles (member_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [memberId, roleId]
    );
  }

  async removeRoleFromMember(roleId: string, memberId: string) {
    await AppDataBase.query(
      `DELETE FROM member_roles WHERE member_id = $1 AND role_id = $2`,
      [memberId, roleId]
    );
  }
}
