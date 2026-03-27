import { Module } from '@nestjs/common';
import { RoleController } from '../controllers/RoleController';
import { PermissionController } from '../controllers/PermissionController';
import { RoleService } from '../services/RoleService';
import { PermissionService } from '../services/PermissionService';
import { RoleRepository } from '../repositories/RoleRepository';
import { PermissionRepository } from '../repositories/PermissionRepository';

@Module({
  controllers: [RoleController, PermissionController],
  providers: [RoleService, PermissionService, RoleRepository, PermissionRepository],
  exports: [RoleService, PermissionService, RoleRepository, PermissionRepository],
})
export class RoleModule {}
