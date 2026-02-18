'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase/client';
import type { MemberProfile } from '@/lib/firebase/schema';

export function useAuthMember() {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    let stopMemberWatch: (() => void) | undefined;
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (stopMemberWatch) {
        stopMemberWatch();
        stopMemberWatch = undefined;
      }
      if (!nextUser) {
        setMember(null);
        setLoading(false);
        return;
      }

      const memberRef = doc(db!, 'members', nextUser.uid);
      stopMemberWatch = onSnapshot(
        memberRef,
        (snapshot) => {
          setMember(snapshot.exists() ? (snapshot.data() as MemberProfile) : null);
          setLoading(false);
        },
        () => {
          setMember(null);
          setLoading(false);
        }
      );
    });

    return () => {
      if (stopMemberWatch) {
        stopMemberWatch();
      }
      unsubscribe();
    };
  }, []);

  return {
    user,
    member,
    loading,
    isApproved: member?.status === 'approved',
    isAdmin: member?.isLeadPastor === true || member?.position === '시무장로',
    canFinance: member?.isFinanceElder === true && member?.departments.includes('재정부'),
  };
}
