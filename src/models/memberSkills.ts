import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("member_skill")
export class MemberSkill {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  member_id: string;

  @Column({ type: "uuid" })
  skill_id: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  data_add: Date;
}