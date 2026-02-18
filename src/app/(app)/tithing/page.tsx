'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon, DollarSign, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase/client';
import type { MemberProfile, TithingRecord } from '@/lib/firebase/schema';
import { useToast } from '@/hooks/use-toast';
import { useAuthMember } from '@/hooks/use-auth-member';

export default function TithingPage() {
  const { toast } = useToast();
  const { user, member, canFinance } = useAuthMember();

  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -90),
    to: new Date(),
  });
  const [newMemberId, setNewMemberId] = useState('');
  const [newType, setNewType] = useState<TithingRecord['type'] | ''>('');
  const [records, setRecords] = useState<TithingRecord[]>([]);
  const [members, setMembers] = useState<MemberProfile[]>([]);

  useEffect(() => {
    if (!db || !user) {
      return;
    }

    const recordsQuery = canFinance
      ? query(collection(db, 'tithingRecords'))
      : query(collection(db, 'tithingRecords'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(recordsQuery, (snapshot) => {
      const docs = snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<TithingRecord, 'id'>) }));
      docs.sort((a, b) => (a.date < b.date ? 1 : -1));
      setRecords(docs);
    });

    return () => unsubscribe();
  }, [canFinance, user]);

  useEffect(() => {
    if (!db || !canFinance) {
      return;
    }
    const unsubscribe = onSnapshot(collection(db, 'members'), (snapshot) => {
      setMembers(snapshot.docs.map((docSnap) => docSnap.data() as MemberProfile));
    });
    return () => unsubscribe();
  }, [canFinance]);

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        const recordDate = new Date(record.date);
        if (!date?.from || !date?.to) {
          return true;
        }
        return recordDate >= date.from && recordDate <= date.to;
      }),
    [date, records]
  );

  const total = filteredRecords.reduce((acc, record) => acc + Number(record.amount || 0), 0);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db || !user || !member || !canFinance) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const userId = newMemberId;
    const userName = members.find((item) => item.uid === userId)?.koreanName || '';

    await addDoc(collection(db, 'tithingRecords'), {
      userId,
      userName,
      date: String(formData.get('date') || ''),
      type: newType,
      amount: Number(formData.get('amount') || 0),
      memo: String(formData.get('memo') || ''),
      createdBy: user.uid,
      updatedAt: new Date().toISOString(),
    });

    toast({ title: '헌금 내역 저장', description: '새 헌금 내역을 저장했습니다.' });
    event.currentTarget.reset();
    setNewMemberId('');
    setNewType('');
  };

  const handleDelete = async (id: string) => {
    if (!db || !canFinance) {
      return;
    }
    await deleteDoc(doc(db, 'tithingRecords', id));
  };

  const handleQuickEdit = async (record: TithingRecord) => {
    if (!db || !canFinance) {
      return;
    }
    const nextMemo = window.prompt('메모를 수정하세요', record.memo || '');
    if (nextMemo === null) {
      return;
    }
    await updateDoc(doc(db, 'tithingRecords', record.id), {
      memo: nextMemo,
      updatedAt: new Date().toISOString(),
    });
    toast({ title: '수정 완료', description: '헌금 내역 메모가 수정되었습니다.' });
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="font-headline text-2xl">헌금 내역</CardTitle>
              <CardDescription>
                {canFinance
                  ? '재정부 재정장로 권한으로 헌금 내역을 입력/수정/삭제합니다.'
                  : '본인 헌금 내역만 조회할 수 있습니다.'}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('w-[260px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'yyyy-MM-dd')} ~ {format(date.to, 'yyyy-MM-dd')}
                        </>
                      ) : (
                        format(date.from, 'yyyy-MM-dd')
                      )
                    ) : (
                      <span>조회 기간 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
                </PopoverContent>
              </Popover>

              {canFinance && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      내역 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>헌금 내역 입력</DialogTitle>
                      <DialogDescription>재정부 소속 재정장로만 사용 가능합니다.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="memberId">교인</Label>
                        <Select value={newMemberId} onValueChange={setNewMemberId} required>
                          <SelectTrigger id="memberId">
                            <SelectValue placeholder="교인을 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            {members
                              .filter((item) => item.status === 'approved')
                              .map((item) => (
                                <SelectItem key={item.uid} value={item.uid}>
                                  {item.koreanName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">날짜</Label>
                          <Input id="date" name="date" type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">종류</Label>
                          <Select value={newType} onValueChange={(value) => setNewType(value as TithingRecord['type'])} required>
                            <SelectTrigger id="type">
                              <SelectValue placeholder="종류 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="십일조">십일조</SelectItem>
                              <SelectItem value="주일헌금">주일헌금</SelectItem>
                              <SelectItem value="감사헌금">감사헌금</SelectItem>
                              <SelectItem value="건축헌금">건축헌금</SelectItem>
                              <SelectItem value="선교헌금">선교헌금</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amount">금액</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input id="amount" name="amount" type="number" placeholder="0" className="pl-8" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="memo">메모</Label>
                        <Input id="memo" name="memo" placeholder="선택 입력" />
                      </div>

                      <Button type="submit" className="w-full" disabled={!newMemberId || !newType}>
                        저장
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {canFinance && <TableHead>교인</TableHead>}
                <TableHead>날짜</TableHead>
                <TableHead>종류</TableHead>
                <TableHead>메모</TableHead>
                <TableHead className="text-right">금액</TableHead>
                {canFinance && <TableHead className="w-[120px] text-right">관리</TableHead>}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canFinance ? 6 : 4} className="h-20 text-center">
                    선택 기간에 조회된 헌금 내역이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    {canFinance && <TableCell>{record.userName || '-'}</TableCell>}
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell className="text-muted-foreground">{record.memo || '-'}</TableCell>
                    <TableCell className="text-right">${Number(record.amount).toFixed(2)}</TableCell>
                    {canFinance && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" title="수정" onClick={() => handleQuickEdit(record)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" title="삭제" onClick={() => handleDelete(record.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={canFinance ? 4 : 3} className="font-semibold">
                  합계
                </TableCell>
                <TableCell className="text-right font-semibold">${total.toFixed(2)}</TableCell>
                {canFinance && <TableCell />}
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
