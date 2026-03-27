import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CourseUniversity } from "./courseUniversity";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  // university relation removed: now accessed through CourseUniversity entity
  // courses don't have direct university_id column anymore
  // use courseUniversities relation to access university info

  @OneToMany(() => CourseUniversity, (cu) => cu.course)
  courseUniversities: CourseUniversity[];
}
