import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAcademicAndCarSystem1739000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela states
    await queryRunner.createTable(
      new Table({
        name: "states",
        columns: [
          { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
          { name: "name", type: "varchar", length: "100" },
          { name: "uf", type: "varchar", length: "2", isUnique: true },
        ],
      })
    );

    // Seed estados brasileiros
    await queryRunner.query(`
      INSERT INTO states (id, name, uf) VALUES
      (uuid_generate_v4(), 'Acre', 'AC'),
      (uuid_generate_v4(), 'Alagoas', 'AL'),
      (uuid_generate_v4(), 'Amapá', 'AP'),
      (uuid_generate_v4(), 'Amazonas', 'AM'),
      (uuid_generate_v4(), 'Bahia', 'BA'),
      (uuid_generate_v4(), 'Ceará', 'CE'),
      (uuid_generate_v4(), 'Distrito Federal', 'DF'),
      (uuid_generate_v4(), 'Espírito Santo', 'ES'),
      (uuid_generate_v4(), 'Goiás', 'GO'),
      (uuid_generate_v4(), 'Maranhão', 'MA'),
      (uuid_generate_v4(), 'Mato Grosso', 'MT'),
      (uuid_generate_v4(), 'Mato Grosso do Sul', 'MS'),
      (uuid_generate_v4(), 'Minas Gerais', 'MG'),
      (uuid_generate_v4(), 'Pará', 'PA'),
      (uuid_generate_v4(), 'Paraíba', 'PB'),
      (uuid_generate_v4(), 'Paraná', 'PR'),
      (uuid_generate_v4(), 'Pernambuco', 'PE'),
      (uuid_generate_v4(), 'Piauí', 'PI'),
      (uuid_generate_v4(), 'Rio de Janeiro', 'RJ'),
      (uuid_generate_v4(), 'Rio Grande do Norte', 'RN'),
      (uuid_generate_v4(), 'Rio Grande do Sul', 'RS'),
      (uuid_generate_v4(), 'Rondônia', 'RO'),
      (uuid_generate_v4(), 'Roraima', 'RR'),
      (uuid_generate_v4(), 'Santa Catarina', 'SC'),
      (uuid_generate_v4(), 'São Paulo', 'SP'),
      (uuid_generate_v4(), 'Sergipe', 'SE'),
      (uuid_generate_v4(), 'Tocantins', 'TO')
    `);

    // Criar tabela cities
    await queryRunner.createTable(
      new Table({
        name: "cities",
        columns: [
          { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
          { name: "name", type: "varchar", length: "100" },
          { name: "ibge_code", type: "varchar", length: "10", isNullable: true },
          { name: "state_id", type: "uuid" },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "cities",
      new TableForeignKey({
        columnNames: ["state_id"],
        referencedTableName: "states",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    // Criar tabela universities
    await queryRunner.createTable(
      new Table({
        name: "universities",
        columns: [
          { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
          { name: "name", type: "varchar", length: "255" },
          { name: "acronym", type: "varchar", length: "50", isNullable: true },
        ],
      })
    );

    // Criar tabela courses
    await queryRunner.createTable(
      new Table({
        name: "courses",
        columns: [
          { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
          { name: "name", type: "varchar", length: "255" },
          { name: "campus", type: "varchar", length: "255", isNullable: true },
          { name: "university_id", type: "uuid" },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "courses",
      new TableForeignKey({
        columnNames: ["university_id"],
        referencedTableName: "universities",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    // Criar tabela cars
    await queryRunner.createTable(
      new Table({
        name: "cars",
        columns: [
          { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
          { name: "name", type: "varchar", length: "255" },
          { name: "description", type: "text", isNullable: true },
          { name: "created_at", type: "timestamp", default: "now()" },
        ],
      })
    );

    // Criar tabela car_cities
    await queryRunner.createTable(
      new Table({
        name: "car_cities",
        columns: [
          { name: "car_id", type: "uuid" },
          { name: "city_id", type: "uuid" },
        ],
      })
    );

    await queryRunner.createForeignKeys("car_cities", [
      new TableForeignKey({
        columnNames: ["car_id"],
        referencedTableName: "cars",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["city_id"],
        referencedTableName: "cities",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    ]);

    // Criar tabela car_managers
    await queryRunner.createTable(
      new Table({
        name: "car_managers",
        columns: [
          { name: "car_id", type: "uuid" },
          { name: "member_id", type: "uuid" },
        ],
      })
    );

    await queryRunner.createForeignKeys("car_managers", [
      new TableForeignKey({
        columnNames: ["car_id"],
        referencedTableName: "cars",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["member_id"],
        referencedTableName: "members",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    ]);

    // Migrar dados existentes de members
    // Extrair universidades únicas
    await queryRunner.query(`
      INSERT INTO universities (id, name)
      SELECT uuid_generate_v4(), university
      FROM (SELECT DISTINCT university FROM members WHERE university IS NOT NULL AND university != '') AS unique_universities
    `);

    // Extrair cursos únicos e vincular com universidades
    await queryRunner.query(`
      INSERT INTO courses (id, name, campus, university_id)
      SELECT 
        uuid_generate_v4(),
        m.course,
        m.campus,
        u.id
      FROM (SELECT DISTINCT university, course, campus FROM members WHERE course IS NOT NULL) m
      JOIN universities u ON u.name = m.university
    `);

    // Adicionar colunas course_id e city_id em members
    await queryRunner.query(`ALTER TABLE members ADD COLUMN course_id UUID`);
    await queryRunner.query(`ALTER TABLE members ADD COLUMN city_id UUID`);

    // Migrar dados para course_id
    await queryRunner.query(`
      UPDATE members m
      SET course_id = c.id
      FROM courses c
      JOIN universities u ON c.university_id = u.id
      WHERE c.name = m.course AND u.name = m.university
    `);

    // Adicionar foreign keys
    await queryRunner.createForeignKey(
      "members",
      new TableForeignKey({
        columnNames: ["course_id"],
        referencedTableName: "courses",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      })
    );

    await queryRunner.createForeignKey(
      "members",
      new TableForeignKey({
        columnNames: ["city_id"],
        referencedTableName: "cities",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      })
    );

    // Remover colunas antigas
    await queryRunner.dropColumn("members", "university");
    await queryRunner.dropColumn("members", "course");
    await queryRunner.dropColumn("members", "campus");

    // Adicionar role CAR
    await queryRunner.query(`
      INSERT INTO roles (id, name, description)
      VALUES (uuid_generate_v4(), 'CAR', 'Conselheiro Acadêmico Regional')
      ON CONFLICT (name) DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recriar colunas antigas
    await queryRunner.query(`ALTER TABLE members ADD COLUMN university VARCHAR(255)`);
    await queryRunner.query(`ALTER TABLE members ADD COLUMN course VARCHAR(255)`);
    await queryRunner.query(`ALTER TABLE members ADD COLUMN campus VARCHAR(255)`);

    // Restaurar dados
    await queryRunner.query(`
      UPDATE members m
      SET 
        university = u.name,
        course = c.name,
        campus = c.campus
      FROM courses c
      JOIN universities u ON c.university_id = u.id
      WHERE m.course_id = c.id
    `);

    // Dropar foreign keys
    const membersTable = await queryRunner.getTable("members");
    const courseFk = membersTable?.foreignKeys.find(fk => fk.columnNames.indexOf("course_id") !== -1);
    const cityFk = membersTable?.foreignKeys.find(fk => fk.columnNames.indexOf("city_id") !== -1);
    if (courseFk) await queryRunner.dropForeignKey("members", courseFk);
    if (cityFk) await queryRunner.dropForeignKey("members", cityFk);

    // Dropar colunas
    await queryRunner.dropColumn("members", "course_id");
    await queryRunner.dropColumn("members", "city_id");

    // Dropar tabelas
    await queryRunner.dropTable("car_managers");
    await queryRunner.dropTable("car_cities");
    await queryRunner.dropTable("cars");
    await queryRunner.dropTable("courses");
    await queryRunner.dropTable("universities");
    await queryRunner.dropTable("cities");
    await queryRunner.dropTable("states");

    // Remover role CAR
    await queryRunner.query(`DELETE FROM roles WHERE name = 'CAR'`);
  }
}
