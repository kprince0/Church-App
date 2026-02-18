import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from '@/firebase/config';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth | null = typeof window !== 'undefined' ? getAuth(app) : null;
export const db: Firestore | null = typeof window !== 'undefined' ? getFirestore(app) : null;
export const storage: FirebaseStorage | null = typeof window !== 'undefined' ? getStorage(app) : null;
