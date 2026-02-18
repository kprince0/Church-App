"use client";

import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { db } from '@/lib/firebase/client';
import type { Department, MemberProfile, TithingRecord } from '@/lib/firebase/schema';
import { useAuthMember } from '@/hooks/use-auth-member';
import { useToast } from '@/hooks/use-toast';

const departments: Department[] = ['예배부', '교육부', '재정부', '선교부', '친교부', '관리부'];

export default function AdminPage() {
  const { user, member, isAdmin, canFinance } = useAuthMember();
  const { toast } = useToast();
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [records, setRecords] = useState<TithingRecord[]>([]);

  useEffect(() => {
    if (!db || !isAdmin) {
      return;
    }
    const unsubMembers = onSnapshot(query(collection(db!, 'members')), (snapshot) => {
      setMembers(snapshot.docs.map((item) => item.data() as MemberProfile));
    });

    const unsubRecords = onSnapshot(query(collection(db!, 'tithingRecords')), (snapshot) => {
      const docs = snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<TithingRecord, 'id'>) }));
      docs.sort((a, b) => (a.date < b.date ? 1 : -1));
      setRecords(docs);
    });

    return () => {
      unsubMembers();
      unsubRecords();
    };
  }, [isAdmin]);

  const pendingMembers = useMemo(() => members.filter((item) => item.status === 'pending'), [members]);

  if (!isAdmin) {
    return (
      <main className="flex-1 p-6">
        <p className="text-sm text-muted-foreground">관리자 권한이 없습니다.</p>
      </main>
    );
  }

  const approveMember = async (uid: string, approved: boolean) => {
    await updateDoc(doc(db!, 'members', uid), {
      status: approved ? 'approved' : 'rejected',
      updatedAt: new Date().toISOString(),
    });
  };

  const updateRole = async (uid: string, payload: Partial<MemberProfile>) => {
    await updateDoc(doc(db!, 'members', uid), {
      ...payload,
      updatedAt: new Date().toISOString(),
    });
    toast({ title: '권한 업데이트', description: '교인 권한이 반영되었습니다.' });
  };

  const createDepartmentRooms = async () => {
    if (!db || !user) {
      return;
    }
    for (const department of departments) {
      const memberIds = members.filter((item) => item.departments.includes(department) && item.status === 'approved').map((item) => item.uid);
      await addDoc(collection(db!, 'chats'), {
        type: 'group',
        name: department,
        isDepartment: true,
        department,
        members: memberIds,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    toast({ title: '기관 채팅방 생성', description: '기본 기관 채팅방을 생성했습니다.' });
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>관리자 콘솔</CardTitle>
            <CardDescription>교인 승인, 권한 부여, 헌금 내역 관리를 수행합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={createDepartmentRooms}>기본 기관 채팅방 생성</Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="approval" className="space-y-4">
          <TabsList>
            <TabsTrigger value="approval">교인 승인</TabsTrigger>
            <TabsTrigger value="roles">권한 부여</TabsTrigger>
            <TabsTrigger value="finance">헌금 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="approval" className="space-y-3">
            {pendingMembers.length === 0 && <p className="text-sm text-muted-foreground">승인 대기 중인 교인이 없습니다.</p>}
            {pendingMembers.map((candidate) => (
              <Card key={candidate.uid}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{candidate.koreanName} ({candidate.englishName})</p>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => approveMember(candidate.uid, true)}>승인</Button>
                    <Button variant="outline" onClick={() => approveMember(candidate.uid, false)}>반려</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="roles" className="space-y-3">
            {members.filter((item) => item.status === 'approved').map((item) => (
              <Card key={item.uid}>
                <CardContent className="space-y-3 p-4">
                  <div>
                    <p className="font-semibold">{item.koreanName}</p>
                    <p className="text-sm text-muted-foreground">{item.email}</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>직분</Label>
                      <Select value={item.position} onValueChange={(value) => updateRole(item.uid, { position: value as MemberProfile['position'] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['없음', '서리집사', '안수집사', '은퇴장로', '시무장로', '목회자'].map((position) => (
                            <SelectItem key={position} value={position}>{position}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>관리 권한</Label>
                      <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox checked={item.isLeadPastor === true} onCheckedChange={(checked) => updateRole(item.uid, { isLeadPastor: checked === true })} />
                          담임목사
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox checked={item.isFinanceElder === true} onCheckedChange={(checked) => updateRole(item.uid, { isFinanceElder: checked === true })} />
                          재정장로
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>기관 소속</Label>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {departments.map((department) => {
                          const checked = item.departments.includes(department);
                          return (
                            <label key={department} className="flex items-center gap-2 text-xs">
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(value) => {
                                  const next = value === true
                                    ? Array.from(new Set([...item.departments, department]))
                                    : item.departments.filter((it) => it !== department);
                                  updateRole(item.uid, { departments: next });
                                }}
                              />
                              {department}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="finance" className="space-y-3">
            {!canFinance && <p className="text-sm text-muted-foreground">재정부 재정장로 권한이 없으면 헌금 수정 권한이 제한됩니다.</p>}
            {records.map((record) => (
              <Card key={record.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{record.userName} · {record.type}</p>
                    <p className="text-sm text-muted-foreground">{record.date} · ${Number(record.amount).toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const amount = window.prompt('금액을 입력하세요', String(record.amount));
                        if (!amount) return;
                        await updateDoc(doc(db!, 'tithingRecords', record.id), {
                          amount: Number(amount),
                          updatedAt: new Date().toISOString(),
                        });
                      }}
                      disabled={!canFinance}
                    >
                      금액 수정
                    </Button>
                    <Button
                      onClick={async () => {
                        await updateDoc(doc(db!, 'tithingRecords', record.id), {
                          memo: '관리자 확인',
                          updatedAt: new Date().toISOString(),
                        });
                      }}
                      disabled={!canFinance}
                    >
                      메모 업데이트
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        await deleteDoc(doc(db!, 'tithingRecords', record.id));
                      }}
                      disabled={!canFinance}
                    >
                      삭제
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
