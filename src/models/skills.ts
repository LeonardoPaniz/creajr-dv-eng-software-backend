import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("skills")
export class Skill {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;
}