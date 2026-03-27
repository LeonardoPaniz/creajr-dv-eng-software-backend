import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { City } from "./city";

@Entity("states")
export class State {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 2, unique: true })
  uf: string;

  @OneToMany(() => City, (city) => city.state)
  cities: City[];
}
