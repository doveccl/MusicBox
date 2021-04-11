import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { pinyin, abbr } from '../util/pinyin'

@Entity()
export class Song extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  index: string

  @Column()
  title: string

  @Column()
  artist: string

  @Column({ default: 0 })
  priority: number

  @Column('text')
  lyric: string

  @Column('text', { nullable: true })
  music: string

  @Column({ default: false })
  danger: boolean

  @Column({ default: false })
  deleted: boolean

  generateIndex() {
    const index = [this.title, this.artist]
    index.push(pinyin(this.title))
    index.push(abbr(this.title))
    index.push(pinyin(this.artist))
    index.push(abbr(this.artist))
    return index.join('|')
  }
}
