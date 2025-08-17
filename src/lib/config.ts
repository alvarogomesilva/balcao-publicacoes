
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzPNXOLfZa4smZoSGXajmnVrfHUKVjE-o",
  authDomain: "balcao-publicacoes.firebaseapp.com",
  projectId: "balcao-publicacoes",
  storageBucket: "balcao-publicacoes.firebasestorage.app",
  messagingSenderId: "871403043152",
  appId: "1:871403043152:web:b5c0bd6e1e089c50559455"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const database = getFirestore(app)