import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase/client';
import type { MemberProfile, Position } from '@/lib/firebase/schema';

function now() {
  return new Date().toISOString();
}

function requireFirebase() {
  if (!auth || !db) {
    throw new Error('Firebase 클라이언트 설정이 없습니다.');
  }
  return { auth, db };
}

export async function loginWithEmail(email: string, password: string) {
  const { auth } = requireFirebase();
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  const { auth } = requireFirebase();
  return signOut(auth);
}

type RegisterPayload = {
  email: string;
  password: string;
  koreanName: string;
  englishName: string;
  phone: string;
  position: Position;
  positionDate?: string;
  positionChurch?: string;
  address: MemberProfile['address'];
  family: MemberProfile['family'];
};

export async function registerMember(payload: RegisterPayload) {
  const { auth, db } = requireFirebase();
  const credential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);

  await updateProfile(credential.user, { displayName: payload.koreanName });

  const profile: MemberProfile = {
    uid: credential.user.uid,
    koreanName: payload.koreanName,
    englishName: payload.englishName,
    phone: payload.phone,
    email: payload.email,
    status: 'pending',
    position: payload.position,
    positionDate: payload.positionDate,
    positionChurch: payload.positionChurch,
    isLeadPastor: false,
    isFinanceElder: false,
    departments: [],
    address: payload.address,
    family: payload.family,
    createdAt: now(),
    updatedAt: now(),
  };

  await setDoc(doc(db, 'members', credential.user.uid), profile);
  return credential;
}

export async function getMemberProfile(uid: string) {
  const { db } = requireFirebase();
  const snapshot = await getDoc(doc(db, 'members', uid));
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data() as MemberProfile;
}
