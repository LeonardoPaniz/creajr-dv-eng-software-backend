import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CourseUniversity } from "./courseUniversity";

@Entity("universities")
export class University {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 50, nullable: true })
  acronym: string;

  // direct relationship to courses removed: now accessed through CourseUniversity entity
  @OneToMany(() => CourseUniversity, (cu) => cu.university)
  courseUniversities: CourseUniversity[];
}
