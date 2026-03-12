import type { PublicationCollection } from "./types";

type PublicationConfig = {
  collection: PublicationCollection;
  category: string;
  queryKey: readonly [PublicationCollection];
  singularLabel: string;
};

export const publicationConfigs: Record<PublicationCollection, PublicationConfig> = {
  books: {
    collection: "books",
    category: "livro",
    queryKey: ["books"],
    singularLabel: "Livro",
  },
  awaken: {
    collection: "awaken",
    category: "despertai",
    queryKey: ["awaken"],
    singularLabel: "Despertai",
  },
  sentinels: {
    collection: "sentinels",
    category: "sentinela",
    queryKey: ["sentinels"],
    singularLabel: "Sentinela",
  },
  others: {
    collection: "others",
    category: "outras-publicacoes",
    queryKey: ["others"],
    singularLabel: "Outra publicação",
  },
};

export function getPublicationConfig(collection: PublicationCollection) {
  return publicationConfigs[collection];
}
