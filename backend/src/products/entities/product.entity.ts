import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ 
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0.00 
  })
  price: number;

  @Column({ 
    type: 'integer',
    nullable: false,
    default: 0 
  })
  stock: number;

  @Column({ 
    name: 'image_url',
    length: 255,
    nullable: true 
  })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 