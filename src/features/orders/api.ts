import { database } from "@/lib/config";
import type { PublicationCollection } from "@/features/publications/types";
import type { CreateOrderValues, Order, OrderItem, OrderItemInput, OrderStatus } from "./types";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  limit,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

function mapOrderData(id: string, data: DocumentData): Order {
  const items = Array.isArray(data.items)
    ? data.items.map(
        (item: Record<string, unknown>): OrderItem => ({
          publicationId: String(item.publicationId ?? ""),
          publicationCollection: (item.publicationCollection ?? "books") as PublicationCollection,
          publicationName: String(item.publicationName ?? ""),
          quantity: Number(item.quantity ?? 0),
          unitPrice: Number(item.unitPrice ?? 0),
          total: Number(item.total ?? 0),
        }),
      )
    : [];

  return {
    id,
    code: String(data.code ?? ""),
    customerId: String(data.customerId ?? ""),
    customerName: String(data.customerName ?? ""),
    status: (data.status ?? "novo") as OrderStatus,
    notes: String(data.notes ?? ""),
    items,
    totalAmount: Number(data.totalAmount ?? 0),
    stockCommitted: Boolean(data.stockCommitted),
    createdAt: data.createdAt?.toDate?.() ?? data.createdAt ?? null,
    updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt ?? null,
  };
}

function mapOrderDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): Order {
  return mapOrderData(docSnapshot.id, docSnapshot.data());
}

function buildOrderCode(seed: string) {
  const stamp = new Date().getFullYear().toString().slice(-2);
  return `PED-${stamp}${seed.slice(0, 6).toUpperCase()}`;
}

function normalizeItems(items: OrderItemInput[]) {
  return items.map((item) => ({
    publicationId: item.publicationId,
    publicationCollection: item.publicationCollection,
    publicationName: item.publicationName,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
    total: Number(item.quantity) * Number(item.unitPrice),
  }));
}

export async function fetchOrders(): Promise<Order[]> {
  const ordersQuery = query(collection(database, "orders"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(ordersQuery);

  return snapshot.docs.map(mapOrderDoc);
}

export async function fetchRecentOrders(maxItems = 8): Promise<Order[]> {
  const ordersQuery = query(
    collection(database, "orders"),
    orderBy("createdAt", "desc"),
    limit(maxItems),
  );
  const snapshot = await getDocs(ordersQuery);

  return snapshot.docs.map(mapOrderDoc);
}

export async function createOrder(values: CreateOrderValues) {
  const orderRef = doc(collection(database, "orders"));
  const code = buildOrderCode(orderRef.id);
  const items = normalizeItems(values.items);
  const totalAmount = items.reduce((acc, item) => acc + item.total, 0);

  await runTransaction(database, async (transaction) => {
    const customerRef = doc(database, "customers", values.customerId);
    const customerSnapshot = await transaction.get(customerRef);

    if (!customerSnapshot.exists()) {
      throw new Error("Cliente nao encontrado.");
    }

    if (!customerSnapshot.data().active) {
      throw new Error("Cliente inativo. Reative antes de criar um pedido.");
    }

    const localStocks = new Map<string, number>();

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error("Cada item precisa ter quantidade valida.");
      }

      const stockKey = `${item.publicationCollection}:${item.publicationId}`;
      const publicationRef = doc(database, item.publicationCollection, item.publicationId);
      const publicationSnapshot = await transaction.get(publicationRef);

      if (!publicationSnapshot.exists()) {
        throw new Error(`Publicacao nao encontrada: ${item.publicationName}.`);
      }

      const currentStock = localStocks.has(stockKey)
        ? Number(localStocks.get(stockKey))
        : Number(publicationSnapshot.data().stock ?? 0);
      const nextStock = currentStock - item.quantity;

      if (nextStock < 0) {
        throw new Error(`Estoque insuficiente para ${item.publicationName}.`);
      }

      localStocks.set(stockKey, nextStock);

      const movementRef = doc(collection(database, "movements"));

      transaction.set(movementRef, {
        publication: item.publicationId,
        publicationCollection: item.publicationCollection,
        publicationName: item.publicationName,
        type: "saida",
        quantity: item.quantity,
        previousStock: currentStock,
        nextStock,
        reason: "pedido",
        orderId: orderRef.id,
        orderCode: code,
        createdAt: serverTimestamp(),
      });

      transaction.update(publicationRef, {
        stock: nextStock,
        updatedAt: serverTimestamp(),
      });
    }

    transaction.set(orderRef, {
      code,
      customerId: values.customerId,
      customerName: values.customerName,
      status: "novo",
      notes: values.notes.trim(),
      items,
      totalAmount,
      stockCommitted: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  return orderRef.id;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const orderRef = doc(database, "orders", id);

  await runTransaction(database, async (transaction) => {
    const orderSnapshot = await transaction.get(orderRef);

    if (!orderSnapshot.exists()) {
      throw new Error("Pedido nao encontrado.");
    }

    const order = mapOrderData(orderSnapshot.id, orderSnapshot.data());

    if (order.status === status) {
      return;
    }

    if (order.status === "cancelado" && status !== "cancelado") {
      throw new Error("Pedidos cancelados nao podem ser reabertos.");
    }

    if (status === "cancelado" && order.stockCommitted) {
      for (const item of order.items) {
        const publicationRef = doc(database, item.publicationCollection, item.publicationId);
        const publicationSnapshot = await transaction.get(publicationRef);

        if (!publicationSnapshot.exists()) {
          continue;
        }

        const currentStock = Number(publicationSnapshot.data().stock ?? 0);
        const nextStock = currentStock + item.quantity;
        const movementRef = doc(collection(database, "movements"));

        transaction.set(movementRef, {
          publication: item.publicationId,
          publicationCollection: item.publicationCollection,
          publicationName: item.publicationName,
          type: "entrada",
          quantity: item.quantity,
          previousStock: currentStock,
          nextStock,
          reason: "cancelamento-pedido",
          orderId: order.id,
          orderCode: order.code,
          createdAt: serverTimestamp(),
        });

        transaction.update(publicationRef, {
          stock: nextStock,
          updatedAt: serverTimestamp(),
        });
      }
    }

    transaction.update(orderRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function updateOrderNotes(id: string, notes: string) {
  const orderRef = doc(database, "orders", id);

  await updateDoc(orderRef, {
    notes: notes.trim(),
    updatedAt: serverTimestamp(),
  });
}
