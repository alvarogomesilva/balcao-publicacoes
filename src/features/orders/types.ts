import type { Timestamp } from "firebase/firestore";
import type { PublicationCollection } from "@/features/publications/types";

export type OrderStatus =
  | "novo"
  | "separando"
  | "enviado"
  | "entregue"
  | "cancelado";

export interface OrderItemInput {
  publicationId: string;
  publicationCollection: PublicationCollection;
  publicationName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderItem extends OrderItemInput {
  total: number;
}

export interface Order {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  notes: string;
  items: OrderItem[];
  totalAmount: number;
  stockCommitted: boolean;
  createdAt?: Timestamp | Date | null;
  updatedAt?: Timestamp | Date | null;
}

export interface CreateOrderValues {
  customerId: string;
  customerName: string;
  notes: string;
  items: OrderItemInput[];
}
