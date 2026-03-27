import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsArray } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ 
    example: 'COORDENADOR', 
    description: 'Nome da role (deve ser único e em MAIÚSCULAS)' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'Coordenador de projetos', 
    description: 'Descrição da role',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoleDto {
  @ApiProperty({ 
    example: 'COORDENADOR', 
    description: 'Nome da role',
    required: false 
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    example: 'Coordenador de projetos e eventos', 
    description: 'Descrição da role',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AssignPermissionsDto {
  @ApiProperty({ 
    example: ['uuid-permission-1', 'uuid-permission-2'], 
    description: 'Array de IDs das permissões',
    type: [String]
  })
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}

export class AssignRoleToMemberDto {
  @ApiProperty({ 
    example: 'uuid-do-membro', 
    description: 'ID do membro' 
  })
  @IsUUID()
  memberId: string;
}
