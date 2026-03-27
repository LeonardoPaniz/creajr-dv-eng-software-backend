import { Injectable } from '@nestjs/common';
import { AppDataBase } from "../db";
import { Member } from "../models/member";

@Injectable()
export class MemberRepository {
  private repository = AppDataBase.getRepository(Member);

  async findAll() {
    return this.repository.find();
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async findByEmail(email: string) {
    return this.repository.findOneBy({ email_personal: email });
  }

  async findByEmailWithPassword(email: string) {
    return this.repository.findOne({
      where: { email_personal: email },
      select: ["id", "password", "email_personal", "name"],
      relations: ["roles"],
    });
  }

  async findBySponsor(sponsorId: string) {
    return this.repository.findBy({ sponsor: sponsorId });
  }

  async findByName(name: string) {
    return this.repository.findOne({ where: { name } });
  }

  async existsByEmailOrCpfOrRa(email_personal: string, email_university: string, cpf: string, ra: string) {
    return this.repository.findOne({
      where: [
        { email_personal },
        { email_university },
        { cpf },
        { ra },
      ],
    });
  }

  async create(memberData: Partial<Member>) {
    const member = this.repository.create(memberData);
    return this.repository.save(member);
  }

  async update(id: string, updateData: Partial<Member>) {
    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async findByIdWithRolesAndPermissions(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: ["roles", "roles.permissions"],
    });
  }

  async findByIdWithRelations(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: [
        "city",
        "roles",
        "memberCourses",
        "memberCourses.courseUniversity",
        "memberCourses.courseUniversity.course",
        "memberCourses.courseUniversity.university",
      ],
    });
  }

  async addCourseToMember(
    memberId: string,
    courseUniversityId: string,
    startedAt?: Date,
  ) {
    const dateStr =
      (startedAt || new Date()).toISOString().split("T")[0];
    await this.repository.manager.query(
      `INSERT INTO member_courses (member_id, course_university_id, status, started_at)
       VALUES ($1, $2, 'active', $3)
       ON CONFLICT (member_id, course_university_id) DO NOTHING`,
      [memberId, courseUniversityId, dateStr],
    );
  }

  async findByNameSlug(slug: string) {
    return this.repository.findOne({
      where: { slug: slug },
      relations: [
        "city",
        "roles",
        "memberCourses",
        "memberCourses.courseUniversity",
        "memberCourses.courseUniversity.course",
        "memberCourses.courseUniversity.university",
      ],
    });
  }
}
