import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAcademicSystemAdvanced1739100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar ENUMs
    await queryRunner.query(`
      CREATE TYPE enum_semester_offering_status AS ENUM (
        'planned',
        'active',
        'closed',
        'cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE enum_member_course_status AS ENUM (
        'active',
        'suspended',
        'completed',
        'cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE enum_enrollment_status AS ENUM (
        'active',
        'approved',
        'failed',
        'suspended',
        'cancelled'
      )
    `);

    // Criar função global updated_at
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    // Criar tabela course_universities
    await queryRunner.query(`
      CREATE TABLE course_universities (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
        city_id uuid NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz,
        UNIQUE(course_id, university_id, city_id)
      )
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_course_universities_updated
      BEFORE UPDATE ON course_universities
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
    `);

    // Criar tabela program_semesters
    await queryRunner.query(`
      CREATE TABLE program_semesters (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        semester_number int NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz,
        UNIQUE(course_id, semester_number)
      )
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_program_semesters_updated
      BEFORE UPDATE ON program_semesters
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
    `);

    // Criar tabela program_semester_heads
    await queryRunner.query(`
      CREATE TABLE program_semester_heads (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        program_semester_id uuid NOT NULL REFERENCES program_semesters(id) ON DELETE CASCADE,
        member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        start_date date DEFAULT current_date,
        end_date date,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz
      )
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_program_semester_heads_updated
      BEFORE UPDATE ON program_semester_heads
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
    `);

    // Criar tabela academic_terms
    await queryRunner.query(`
      CREATE TABLE academic_terms (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        year int NOT NULL,
        term varchar(10) NOT NULL,
        starts_at date,
        ends_at date,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz,
        UNIQUE(year, term)
      )
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_academic_terms_updated
      BEFORE UPDATE ON academic_terms
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
    `);

    // Criar tabela semester_offerings
    await queryRunner.query(`
      CREATE TABLE semester_offerings (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_university_id uuid NOT NULL REFERENCES course_universities(id) ON DELETE CASCADE,
        program_semester_id uuid NOT NULL REFERENCES program_semesters(id) ON DELETE CASCADE,
        academic_term_id uuid NOT NULL REFERENCES academic_terms(id) ON DELETE CASCADE,
        status enum_semester_offering_status NOT NULL DEFAULT 'planned',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz,
        UNIQUE(course_university_id, program_semester_id, academic_term_id)
      )
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_semester_offerings_updated
      BEFORE UPDATE ON semester_offerings
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
    `);

    // Criar tabela member_courses
    await queryRunner.query(`
      CREATE TABLE member_courses (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        course_university_id uuid NOT NULL REFERENCES course_universities(id) ON DELETE CASCADE,
        status enum_member_course_status NOT NULL DEFAULT 'active',
        started_at date DEFAULT current_date,
        completed_at date,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz,
        UNIQUE(member_id, course_university_id)
      )
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_member_courses_updated
      BEFORE UPDATE ON member_courses
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
    `);

    // Criar tabela enrollments
    await queryRunner.query(`
      CREATE TABLE enrollments (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        semester_offering_id uuid NOT NULL REFERENCES semester_offerings(id) ON DELETE CASCADE,
        status enum_enrollment_status NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz,
        UNIQUE(member_id, semester_offering_id)
      )
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_enrollments_updated
      BEFORE UPDATE ON enrollments
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
    `);

    // Adicionar soft delete em tabelas existentes
    await queryRunner.query(`ALTER TABLE members ADD COLUMN IF NOT EXISTS deleted_at timestamptz`);
    await queryRunner.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS deleted_at timestamptz`);
    await queryRunner.query(`ALTER TABLE universities ADD COLUMN IF NOT EXISTS deleted_at timestamptz`);
    await queryRunner.query(`ALTER TABLE cars ADD COLUMN IF NOT EXISTS deleted_at timestamptz`);
    await queryRunner.query(`ALTER TABLE cities ADD COLUMN IF NOT EXISTS deleted_at timestamptz`);
    await queryRunner.query(`ALTER TABLE states ADD COLUMN IF NOT EXISTS deleted_at timestamptz`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover soft delete
    await queryRunner.query(`ALTER TABLE states DROP COLUMN IF EXISTS deleted_at`);
    await queryRunner.query(`ALTER TABLE cities DROP COLUMN IF EXISTS deleted_at`);
    await queryRunner.query(`ALTER TABLE cars DROP COLUMN IF EXISTS deleted_at`);
    await queryRunner.query(`ALTER TABLE universities DROP COLUMN IF EXISTS deleted_at`);
    await queryRunner.query(`ALTER TABLE courses DROP COLUMN IF EXISTS deleted_at`);
    await queryRunner.query(`ALTER TABLE members DROP COLUMN IF EXISTS deleted_at`);

    // Dropar tabelas
    await queryRunner.query(`DROP TABLE IF EXISTS enrollments CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS member_courses CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS semester_offerings CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS academic_terms CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS program_semester_heads CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS program_semesters CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS course_universities CASCADE`);

    // Dropar função
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_updated_at() CASCADE`);

    // Dropar ENUMs
    await queryRunner.query(`DROP TYPE IF EXISTS enum_enrollment_status CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS enum_member_course_status CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS enum_semester_offering_status CASCADE`);
  }
}
