import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Member } from "./member";
import { CourseUniversity } from "./courseUniversity";

export enum MemberCourseStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity("member_courses")
export class MemberCourse {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  member_id!: string;

  @ManyToOne(() => Member, (member) => member.memberCourses)
  @JoinColumn({ name: "member_id" })
  member!: Member;

  @Column({ type: "uuid" })
  course_university_id!: string;

  @ManyToOne(() => CourseUniversity, (cu) => cu.memberCourses)
  @JoinColumn({ name: "course_university_id" })
  courseUniversity!: CourseUniversity;

  @Column({
    type: "enum",
    enum: MemberCourseStatus,
    default: MemberCourseStatus.ACTIVE,
  })
  status!: MemberCourseStatus;

  @Column({ type: "date", nullable: true })
  started_at?: Date;

  @Column({ type: "date", nullable: true })
  completed_at?: Date;
}
