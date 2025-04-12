import { Project } from './models/projects';
import { Skill } from './models/skills';
import { ProjectTaskResponsible } from './models/projectTaskResponsible'
import { MemberSkill } from './models/memberSkills';
import { Member } from './models/member';
import { Goal } from './models/goal';
import { ProjectTask } from './models/projectTask';
import { DataSource } from "typeorm";
import { Token } from './models/token';

export const AppDataBase = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  entities: [
    Member,
    MemberSkill,
    Skill,
    Goal,
    ProjectTask,
    ProjectTaskResponsible,
    Project,
    Token
  ],
});