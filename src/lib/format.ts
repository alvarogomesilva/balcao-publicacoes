import type { OrderStatus } from "@/features/orders/types";

export function formatDateTime(value: Date | string | number | null | undefined) {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatCollectionLabel(collection: string) {
  const labels: Record<string, string> = {
    books: "Livros",
    awaken: "Despertais",
    sentinels: "Sentinelas",
    others: "Outras publicacoes",
  };

  return labels[collection] ?? collection;
}

export function formatOrderStatus(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    novo: "Novo",
    separando: "Separando",
    enviado: "Enviado",
    entregue: "Entregue",
    cancelado: "Cancelado",
  };

  return labels[status];
}

export function getOrderStatusColor(status: OrderStatus) {
  const colors: Record<OrderStatus, string> = {
    novo: "blue",
    separando: "orange",
    enviado: "cyan",
    entregue: "teal",
    cancelado: "red",
  };

  return colors[status];
}
