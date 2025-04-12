import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("project_tasks")
export class ProjectTask {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  project_id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "boolean", default: true })
  is_open: boolean;

  @Column({ type: "boolean", default: false })
  done: boolean;
}