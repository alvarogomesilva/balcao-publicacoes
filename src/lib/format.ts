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

export function formatCollectionLabel(collection: string) {
  const labels: Record<string, string> = {
    books: "Livros",
    awaken: "Despertais",
    sentinels: "Sentinelas",
    others: "Outras publicações",
  };

  return labels[collection] ?? collection;
}
