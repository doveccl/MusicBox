import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  name: string

  @Column()
  password: string

  @Column({ default: 0 })
  admin: number
}
