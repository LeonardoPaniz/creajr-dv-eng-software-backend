import { Injectable } from '@nestjs/common';
import { AppDataBase } from "../db";
import { CourseUniversity } from "../models/courseUniversity";

@Injectable()
export class CourseUniversityRepository {
  private repository = AppDataBase.getRepository(CourseUniversity);

  async findAll() {
    return this.repository.find({
      relations: ["course", "university", "city"]
    });
  }

  async findById(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: ["course", "university", "city"]
    });
  }

  async findByCourseAndUniversity(courseId: string, universityId: string) {
    return this.repository.find({
      where: { course_id: courseId, university_id: universityId },
      relations: ["course", "university", "city"]
    });
  }

  async findByCourseUniversityCity(courseId: string, universityId: string, cityId: string) {
    return this.repository.findOne({
      where: { 
        course_id: courseId, 
        university_id: universityId,
        city_id: cityId
      },
      relations: ["course", "university", "city"]
    });
  }

  async create(data: Partial<CourseUniversity>) {
    const courseUniversity = this.repository.create(data);
    return this.repository.save(courseUniversity);
  }

  async update(id: string, data: Partial<CourseUniversity>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }
}
