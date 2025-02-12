import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../../products/entities/product.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private dataSource: DataSource
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    // Utiliser une transaction pour garantir l'intégrité des données
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = new Order();
      order.user = user;
      order.status = OrderStatus.PENDING;

      // Sauvegarder d'abord la commande
      const savedOrder = await queryRunner.manager.save(order);

      // Traiter chaque item
      for (const item of createOrderDto.items) {
        const product = await this.productRepository.findOne({
          where: { id: item.productId }
        });

        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for product ${product.name}`
          );
        }

        // Mettre à jour le stock
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);

        // Créer l'item de commande
        const orderItem = new OrderItem();
        orderItem.order = savedOrder;
        orderItem.product = product;
        orderItem.quantity = item.quantity;
        await queryRunner.manager.save(orderItem);
      }

      await queryRunner.commitTransaction();

      return this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['items', 'items.product']
      });

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // Nouvelle méthode pour admin - toutes les commandes
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items', 'items.product', 'user']
    });
  }

  // Méthode existante renommée pour plus de clarté
  async findAllByUser(user: User): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: user.id } },
      relations: ['items', 'items.product']
    });
  }

  async findOne(id: number, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['items', 'items.product']
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product']
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    order.status = status;
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items']
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.remove(order.items);
      await queryRunner.manager.remove(order);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
} 