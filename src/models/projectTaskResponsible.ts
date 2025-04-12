import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("project_task_responsible")
export class ProjectTaskResponsible {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  task_id: string;

  @Column({ type: "uuid" })
  member_id: string;

  @Column({
    type: "enum",
    enum: ["Pendente", "Aceito", "Recusado"],
    default: "Pendente",
  })
  status: string;
}