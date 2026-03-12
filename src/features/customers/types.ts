import type { Timestamp } from "firebase/firestore";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  notes: string;
  active: boolean;
  createdAt?: Timestamp | Date | null;
  updatedAt?: Timestamp | Date | null;
}

export interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
  city: string;
  notes: string;
  active: boolean;
}
