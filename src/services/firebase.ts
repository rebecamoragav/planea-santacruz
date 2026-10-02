import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Inicializar la app de Firebase (singleton)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializar Firestore con el databaseId configurado
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Validar conexión a Firestore como requiere la directiva del sistema
export async function validarConexionFirestore() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore: Modo sin conexión activo.");
    }
  }
}
