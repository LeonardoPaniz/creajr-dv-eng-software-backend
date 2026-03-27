import { Injectable } from '@nestjs/common';
import { AppDataBase } from "../db";
import { Course } from "../models/course";

@Injectable()
export class CourseRepository {
  private repository = AppDataBase.getRepository(Course);

  async findAll() {
    return this.repository.find({ relations: ["courseUniversities", "courseUniversities.university"] });
  }

  async findById(id: string) {
    return this.repository.findOne({ 
      where: { id }, 
      relations: ["courseUniversities", "courseUniversities.university"] 
    });
  }

  async findByUniversity(universityId: string) {
    return this.repository
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.courseUniversities", "cu")
      .leftJoinAndSelect("cu.university", "university")
      .where("cu.university_id = :universityId", { universityId })
      .getMany();
  }

  async create(data: Partial<Course>) {
    const course = this.repository.create(data);
    return this.repository.save(course);
  }

  async update(id: string, data: Partial<Course>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }
}
