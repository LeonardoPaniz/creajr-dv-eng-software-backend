import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("goal")
export class Goal {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({
    type: "enum",
    enum: [
      "Aquisição de membros",
      "Participar de Projetos",
      "Presença em reuniões",
    ],
  })
  goal_type: string;

  @Column({ type: "int" })
  parameter: number;

  @Column({ type: "date" })
  start_date: Date;

  @Column({ type: "date" })
  end_date: Date;

  @Column({ type: "uuid" })
  creator_id: string;
}
