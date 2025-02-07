import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { eager: true, onDelete: 'RESTRICT' })
  product: Product;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, order => order.items)
  order: Order;
} 