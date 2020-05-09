import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity()
export class Song extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  index: string

  @Column()
  title: string

  @Column()
  artist: string

  @Column({ default: 0 })
  priority: number

  @Column()
  lyric: string

  @Column({ nullable: true })
  music: string

  @Column({ default: false })
  danger: boolean

  @Column({ default: false })
  deleted: boolean
}
