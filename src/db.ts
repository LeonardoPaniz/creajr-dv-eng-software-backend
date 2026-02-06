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
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
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