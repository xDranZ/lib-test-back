import { BookCopy } from '../../book-copies/entities/book-copy.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column()
  author: string;

  @Column({ name: 'cover_image_key', type: 'varchar', nullable: true })
  coverImageKey: string | null;

  @OneToMany(() => BookCopy, (bookCopy) => bookCopy.book)
  copies: BookCopy[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
