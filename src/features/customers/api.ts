import { database } from "@/lib/config";
import type { Customer, CustomerFormValues } from "./types";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

function mapCustomerDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): Customer {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    phone: String(data.phone ?? ""),
    city: String(data.city ?? ""),
    notes: String(data.notes ?? ""),
    active: Boolean(data.active),
    createdAt: data.createdAt?.toDate?.() ?? data.createdAt ?? null,
    updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt ?? null,
  };
}

export async function fetchCustomers(): Promise<Customer[]> {
  const customersQuery = query(collection(database, "customers"), orderBy("name"));
  const snapshot = await getDocs(customersQuery);

  return snapshot.docs.map(mapCustomerDoc);
}

export async function createCustomer(values: CustomerFormValues) {
  await addDoc(collection(database, "customers"), {
    ...values,
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    city: values.city.trim(),
    notes: values.notes.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCustomer(id: string, values: CustomerFormValues) {
  const customerRef = doc(database, "customers", id);

  await updateDoc(customerRef, {
    ...values,
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    city: values.city.trim(),
    notes: values.notes.trim(),
    updatedAt: serverTimestamp(),
  });
}

export async function toggleCustomerActive(id: string, active: boolean) {
  const customerRef = doc(database, "customers", id);

  await updateDoc(customerRef, {
    active,
    updatedAt: serverTimestamp(),
  });
}
