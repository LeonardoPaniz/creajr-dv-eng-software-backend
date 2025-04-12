import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "uuid" })
  leader_id: string;

  @Column({ type: "boolean", default: false })
  is_selective: boolean;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "boolean", default: false })
  done: boolean;

  @Column({ length: 255 })
  location: string;
}