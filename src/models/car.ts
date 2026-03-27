import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn } from "typeorm";
import { City } from "./city";
import { Member } from "./member";

@Entity("cars")
export class Car {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => City, (city) => city.cars)
  @JoinTable({
    name: "car_cities",
    joinColumn: { name: "car_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "city_id", referencedColumnName: "id" },
  })
  cities: City[];

  @ManyToMany(() => Member, (member) => member.managedCars)
  @JoinTable({
    name: "car_managers",
    joinColumn: { name: "car_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "member_id", referencedColumnName: "id" },
  })
  managers: Member[];
}
