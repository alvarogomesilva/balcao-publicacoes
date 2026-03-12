import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

function readEnv(name: string) {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Variavel de ambiente ausente: ${name}`);
  }

  return value;
}

const firebaseConfig = {
  apiKey: readEnv("VITE_API_KEY"),
  authDomain: readEnv("VITE_AUTH_DOMAIN"),
  projectId: readEnv("VITE_PROJECT_ID"),
  storageBucket: readEnv("VITE_STORAGE_BUCKET"),
  messagingSenderId: readEnv("VITE_MESSAGING_SENDER_ID"),
  appId: readEnv("VITE_APP_ID"),
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);
