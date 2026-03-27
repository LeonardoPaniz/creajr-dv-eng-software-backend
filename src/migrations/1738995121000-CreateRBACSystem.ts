import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRBACSystem1738995121000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela roles
    await queryRunner.createTable(
      new Table({
        name: "roles",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "50",
            isUnique: true,
          },
          {
            name: "description",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
        ],
      })
    );

    // Criar tabela permissions
    await queryRunner.createTable(
      new Table({
        name: "permissions",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
            isUnique: true,
          },
          {
            name: "description",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "resource",
            type: "varchar",
            length: "50",
          },
          {
            name: "action",
            type: "varchar",
            length: "50",
          },
        ],
      })
    );

    // Criar tabela member_roles
    await queryRunner.createTable(
      new Table({
        name: "member_roles",
        columns: [
          {
            name: "member_id",
            type: "uuid",
          },
          {
            name: "role_id",
            type: "uuid",
          },
        ],
      })
    );

    // Criar tabela role_permissions
    await queryRunner.createTable(
      new Table({
        name: "role_permissions",
        columns: [
          {
            name: "role_id",
            type: "uuid",
          },
          {
            name: "permission_id",
            type: "uuid",
          },
        ],
      })
    );

    // Adicionar foreign keys
    await queryRunner.createForeignKeys("member_roles", [
      new TableForeignKey({
        columnNames: ["member_id"],
        referencedTableName: "members",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["role_id"],
        referencedTableName: "roles",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    ]);

    await queryRunner.createForeignKeys("role_permissions", [
      new TableForeignKey({
        columnNames: ["role_id"],
        referencedTableName: "roles",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["permission_id"],
        referencedTableName: "permissions",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    ]);

    // Seed roles
    await queryRunner.query(`
      INSERT INTO roles (id, name, description) VALUES
      (uuid_generate_v4(), 'MEMBRO', 'Membro regular da organização'),
      (uuid_generate_v4(), 'LIDER', 'Líder de equipe ou projeto'),
      (uuid_generate_v4(), 'DIRIGENTE', 'Dirigente da organização'),
      (uuid_generate_v4(), 'CA', 'Membro do Conselho Administrativo'),
      (uuid_generate_v4(), 'EQUIPE_TECNICA', 'Equipe técnica do sistema'),
      (uuid_generate_v4(), 'ESTADUAL', 'Representante estadual')
    `);

    // Seed permissions
    await queryRunner.query(`
      INSERT INTO permissions (id, name, description, resource, action) VALUES
      (uuid_generate_v4(), 'VIEW_MEMBERS', 'Visualizar membros', 'members', 'read'),
      (uuid_generate_v4(), 'EDIT_MEMBERS', 'Editar membros', 'members', 'update'),
      (uuid_generate_v4(), 'DELETE_MEMBERS', 'Deletar membros', 'members', 'delete'),
      (uuid_generate_v4(), 'MANAGE_PROJECTS', 'Gerenciar projetos', 'projects', 'manage'),
      (uuid_generate_v4(), 'VIEW_REPORTS', 'Visualizar relatórios', 'reports', 'read'),
      (uuid_generate_v4(), 'MANAGE_ROLES', 'Gerenciar papéis', 'roles', 'manage'),
      (uuid_generate_v4(), 'SYSTEM_ADMIN', 'Administrador do sistema', 'system', 'admin')
    `);

    // Migrar dados existentes de position para roles
    await queryRunner.query(`
      INSERT INTO member_roles (member_id, role_id)
      SELECT m.id, r.id
      FROM members m
      CROSS JOIN roles r
      WHERE 
        (m.position = 'Membro' AND r.name = 'MEMBRO') OR
        (m.position = 'Líder' AND r.name = 'LIDER') OR
        (m.position = 'Dirigente' AND r.name = 'DIRIGENTE')
    `);

    // Remover coluna position da tabela members
    await queryRunner.dropColumn("members", "position");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recriar coluna position
    await queryRunner.query(`
      ALTER TABLE members ADD COLUMN position VARCHAR(255) DEFAULT 'Membro'
    `);

    // Restaurar dados de position
    await queryRunner.query(`
      UPDATE members m
      SET position = CASE
        WHEN EXISTS (SELECT 1 FROM member_roles mr JOIN roles r ON mr.role_id = r.id WHERE mr.member_id = m.id AND r.name = 'DIRIGENTE') THEN 'Dirigente'
        WHEN EXISTS (SELECT 1 FROM member_roles mr JOIN roles r ON mr.role_id = r.id WHERE mr.member_id = m.id AND r.name = 'LIDER') THEN 'Líder'
        ELSE 'Membro'
      END
    `);

    // Dropar tabelas
    await queryRunner.dropTable("role_permissions");
    await queryRunner.dropTable("member_roles");
    await queryRunner.dropTable("permissions");
    await queryRunner.dropTable("roles");
  }
}
