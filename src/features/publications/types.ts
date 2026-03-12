import type { Timestamp } from "firebase/firestore";
import type { Customer } from "@/features/customers/types";
import type { Order } from "@/features/orders/types";

export type PublicationCollection = "books" | "awaken" | "sentinels" | "others";
export type MovementType = "entrada" | "saida";

export interface Publication {
  id: string;
  active: boolean;
  name: string;
  code: string;
  category: string;
  stock: number;
  createdAt?: Timestamp | Date | null;
  updatedAt?: Timestamp | Date | null;
}

export interface PublicationUpdateValues {
  id: string;
  name: string;
}

export interface StockMutationValues {
  id: string;
  quantity: number;
}

export interface Movement {
  id: string;
  publication: string;
  publicationCollection: PublicationCollection;
  publicationName: string;
  type: MovementType;
  quantity: number;
  previousStock: number;
  nextStock: number;
  createdAt?: Timestamp | Date | null;
}

export interface DashboardSummary {
  totalTitles: number;
  activeTitles: number;
  totalStock: number;
  lowStockCount: number;
  totalCustomers: number;
  activeCustomers: number;
  totalOrders: number;
  openOrders: number;
  salesVolume: number;
  collections: Array<{
    collection: PublicationCollection;
    label: string;
    titleCount: number;
    activeCount: number;
    totalStock: number;
  }>;
  recentMovements: Movement[];
  recentOrders: Order[];
  topCustomers: Array<
    Pick<Customer, "id" | "name" | "email" | "phone" | "city"> & {
      orderCount: number;
      totalSpent: number;
    }
  >;
}
