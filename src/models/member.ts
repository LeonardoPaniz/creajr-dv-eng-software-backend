import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("members")
export class Member {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 14, unique: true, select: false })
  cpf!: string;

  @Column({ length: 100, select: false })
  password!: string;

  @Column({ length: 20 })
  phone!: string;

  @Column({ length: 255, unique: true })
  email_personal!: string;

  @Column({ length: 255, unique: true })
  email_university!: string;

  @Column({ length: 10, unique: true })
  ra!: string;

  @Column({ type: "text", nullable: true })
  profile_picture_url?: string;

  @Column({ type: "date" })
  birth_date!: Date;

  @Column({ length: 255 })
  university!: string;

  @Column({ length: 255 })
  course!: string;

  @Column({ length: 255 })
  campus!: string;

  @Column({ type: "date" })
  admission_date!: Date;

  @Column({
    type: "enum",
    enum: ["Membro", "Líder", "Dirigente"],
    default: "Membro",
    nullable: false,
  })
  position!: string;

  @Column({ type: "uuid", nullable: true })
  sponsor?: string;

  @Column({ length: 255, nullable: true })
  biography!: string;

  @Column({ length: 255, nullable: true })
  banner_url!: string;

  @Column({ length: 255, nullable: true })
  curriculum_url!: string;

  @Column({ length: 255, nullable: true })
  youtube_url!: string;

  @Column({ length: 255, nullable: true })
  twitter_url!: string;

  @Column({ length: 255, nullable: true })
  instagram_url!: string;

  @Column({ length: 255, nullable: true })
  linkedin_url!: string;

  @Column({ length: 255, nullable: true })
  github_url!: string;
}
