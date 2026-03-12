import { database } from "@/lib/config";
import type { RegisterPublication } from "@/validations/register-publication-validation";
import type { UpdatePublication } from "@/validations/update-publication-validation";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getPublicationConfig, publicationConfigs } from "./config";
import type {
  DashboardSummary,
  Movement,
  MovementType,
  Publication,
  PublicationCollection,
  PublicationUpdateValues,
  StockMutationValues,
} from "./types";

function mapPublicationDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): Publication {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    active: Boolean(data.active),
    name: String(data.name ?? ""),
    code: String(data.code ?? ""),
    category: String(data.category ?? ""),
    stock: Number(data.stock ?? 0),
    createdAt: data.createdAt?.toDate?.() ?? data.createdAt ?? null,
    updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt ?? null,
  };
}

function mapMovementDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): Movement {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    publication: String(data.publication ?? ""),
    publicationCollection: (data.publicationCollection ?? "books") as PublicationCollection,
    publicationName: String(data.publicationName ?? "Publicação"),
    type: (data.type ?? "entrada") as MovementType,
    quantity: Number(data.quantity ?? 0),
    previousStock: Number(data.previousStock ?? 0),
    nextStock: Number(data.nextStock ?? 0),
    createdAt: data.createdAt?.toDate?.() ?? data.createdAt ?? null,
  };
}

export async function fetchPublications(
  collectionName: PublicationCollection,
): Promise<Publication[]> {
  const publicationsQuery = query(collection(database, collectionName), orderBy("name"));
  const snapshot = await getDocs(publicationsQuery);

  return snapshot.docs.map(mapPublicationDoc);
}

export async function searchPublications(
  collectionName: PublicationCollection,
  search: string,
): Promise<Publication[]> {
  const term = search.trim().toLowerCase();

  if (!term) {
    return [];
  }

  const publications = await fetchPublications(collectionName);
  return publications.filter((item) => item.name.toLowerCase().includes(term));
}

export async function createPublication(
  collectionName: PublicationCollection,
  inputs: RegisterPublication,
) {
  const config = getPublicationConfig(collectionName);
  const { name, code, active } = inputs;

  await addDoc(collection(database, config.collection), {
    active,
    name: name.trim(),
    code: code.trim(),
    category: config.category,
    stock: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updatePublication(
  collectionName: PublicationCollection,
  values: UpdatePublication | PublicationUpdateValues,
) {
  const publicationRef = doc(database, collectionName, values.id);

  await updateDoc(publicationRef, {
    name: values.name.trim(),
    updatedAt: serverTimestamp(),
  });
}

export async function deletePublication(collectionName: PublicationCollection, id: string) {
  await deleteDoc(doc(database, collectionName, id));
}

export async function registerStockMovement(
  collectionName: PublicationCollection,
  values: StockMutationValues,
  type: MovementType,
) {
  const quantity = Number(values.quantity);

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Informe uma quantidade válida.");
  }

  const publicationRef = doc(database, collectionName, values.id);
  const movementsRef = collection(database, "movements");

  await runTransaction(database, async (transaction) => {
    const publicationSnapshot = await transaction.get(publicationRef);

    if (!publicationSnapshot.exists()) {
      throw new Error("Publicação não encontrada.");
    }

    const publicationData = publicationSnapshot.data();
    const currentStock = Number(publicationData.stock ?? 0);
    const nextStock =
      type === "entrada" ? currentStock + quantity : currentStock - quantity;

    if (nextStock < 0) {
      throw new Error("Estoque insuficiente para esta saída.");
    }

    const movementRef = doc(movementsRef);

    transaction.set(movementRef, {
      publication: values.id,
      publicationCollection: collectionName,
      publicationName: String(publicationData.name ?? "Publicação"),
      type,
      quantity,
      previousStock: currentStock,
      nextStock,
      createdAt: serverTimestamp(),
    });

    transaction.update(publicationRef, {
      stock: nextStock,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function fetchRecentMovements(maxItems = 18): Promise<Movement[]> {
  const movementsQuery = query(
    collection(database, "movements"),
    orderBy("createdAt", "desc"),
    limit(maxItems),
  );
  const snapshot = await getDocs(movementsQuery);

  return snapshot.docs.map(mapMovementDoc);
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const collectionNames = Object.keys(publicationConfigs) as PublicationCollection[];
  const [recentMovements, ...publicationGroups] = await Promise.all([
    fetchRecentMovements(8),
    ...collectionNames.map((collectionName) => fetchPublications(collectionName)),
  ]);

  const collectionSummaries = collectionNames.map((collectionName, index) => {
    const publications = publicationGroups[index];
    const config = publicationConfigs[collectionName];

    return {
      collection: collectionName,
      label: config.singularLabel,
      titleCount: publications.length,
      activeCount: publications.filter((item) => item.active).length,
      totalStock: publications.reduce((acc, item) => acc + item.stock, 0),
    };
  });

  const allPublications = publicationGroups.flat();

  return {
    totalTitles: allPublications.length,
    activeTitles: allPublications.filter((item) => item.active).length,
    totalStock: allPublications.reduce((acc, item) => acc + item.stock, 0),
    lowStockCount: allPublications.filter((item) => item.stock <= 5).length,
    collections: collectionSummaries,
    recentMovements,
  };
}

export async function fetchUserProfile(uid: string) {
  const userRef = doc(database, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}
