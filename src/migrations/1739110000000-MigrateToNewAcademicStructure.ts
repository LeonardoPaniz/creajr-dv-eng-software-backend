import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrateToNewAcademicStructure1739110000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Migrar dados existentes de courses para course_universities
    await queryRunner.query(`
      INSERT INTO course_universities (course_id, university_id, city_id)
      SELECT 
        c.id as course_id,
        c.university_id,
        COALESCE(
          (SELECT city_id FROM members WHERE course_id = c.id LIMIT 1),
          (SELECT id FROM cities LIMIT 1)
        ) as city_id
      FROM courses c
      WHERE c.university_id IS NOT NULL
      ON CONFLICT DO NOTHING
    `);

    // Migrar dados de members.course_id para member_courses
    await queryRunner.query(`
      INSERT INTO member_courses (member_id, course_university_id, status, started_at)
      SELECT 
        m.id as member_id,
        cu.id as course_university_id,
        'active' as status,
        m.admission_date as started_at
      FROM members m
      JOIN courses c ON m.course_id = c.id
      JOIN course_universities cu ON cu.course_id = c.id
      WHERE m.course_id IS NOT NULL
      ON CONFLICT DO NOTHING
    `);

    // Remover foreign key de members.course_id
    const membersTable = await queryRunner.getTable("members");
    const courseFk = membersTable?.foreignKeys.find(fk => fk.columnNames.indexOf("course_id") !== -1);
    if (courseFk) {
      await queryRunner.dropForeignKey("members", courseFk);
    }

    // Remover foreign key de courses.university_id
    const coursesTable = await queryRunner.getTable("courses");
    const universityFk = coursesTable?.foreignKeys.find(fk => fk.columnNames.indexOf("university_id") !== -1);
    if (universityFk) {
      await queryRunner.dropForeignKey("courses", universityFk);
    }

    // Remover colunas antigas
    await queryRunner.query(`ALTER TABLE members DROP COLUMN IF EXISTS course_id`);
    await queryRunner.query(`ALTER TABLE courses DROP COLUMN IF EXISTS university_id`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recriar colunas
    await queryRunner.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS university_id UUID`);
    await queryRunner.query(`ALTER TABLE members ADD COLUMN IF NOT EXISTS course_id UUID`);

    // Restaurar dados
    await queryRunner.query(`
      UPDATE courses c
      SET university_id = cu.university_id
      FROM course_universities cu
      WHERE cu.course_id = c.id
    `);

    await queryRunner.query(`
      UPDATE members m
      SET course_id = cu.course_id
      FROM member_courses mc
      JOIN course_universities cu ON mc.course_university_id = cu.id
      WHERE mc.member_id = m.id
    `);

    // Recriar foreign keys
    await queryRunner.query(`
      ALTER TABLE courses 
      ADD CONSTRAINT FK_courses_university 
      FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE members 
      ADD CONSTRAINT FK_members_course 
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
    `);
  }
}
