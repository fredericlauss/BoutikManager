export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
} 