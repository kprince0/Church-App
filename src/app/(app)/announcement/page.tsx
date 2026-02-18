'use client';

import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/lib/firebase/client';
import type { Announcement, MemberProfile } from '@/lib/firebase/schema';
import { useToast } from '@/hooks/use-toast';
import { useAuthMember } from '@/hooks/use-auth-member';

export default function AnnouncementPage() {
  const { user, member, isAdmin } = useAuthMember();
  const { toast } = useToast();
  const [targetUserId, setTargetUserId] = useState('');
  const [received, setReceived] = useState<Announcement[]>([]);
  const [members, setMembers] = useState<MemberProfile[]>([]);

  useEffect(() => {
    if (!db || !user) {
      return;
    }

    const announcementQuery = isAdmin
      ? query(collection(db, 'announcements'))
      : query(collection(db, 'announcements'), where('receiverId', '==', user.uid));

    const unsubscribe = onSnapshot(announcementQuery, (snapshot) => {
      const docs = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<Announcement, 'id'>) }));
      docs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      setReceived(docs);
    });

    return () => unsubscribe();
  }, [isAdmin, user]);

  useEffect(() => {
    if (!db || !isAdmin) {
      return;
    }
    const unsubscribe = onSnapshot(collection(db, 'members'), (snapshot) => {
      const docs = snapshot.docs.map((docSnap) => docSnap.data() as MemberProfile);
      setMembers(docs.filter((item) => item.status === 'approved'));
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const receivedForMe = useMemo(() => {
    if (!user) {
      return [];
    }
    return received.filter((item) => item.receiverId === user.uid || isAdmin);
  }, [isAdmin, received, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db || !user || !member || !isAdmin) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') || '');
    const content = String(formData.get('content') || '');

    await addDoc(collection(db, 'announcements'), {
      senderId: user.uid,
      senderName: member.koreanName,
      receiverId: targetUserId,
      title,
      content,
      createdAt: new Date().toISOString(),
    });

    toast({ title: '공지 발송 완료', description: '선택한 교인에게 개별 공지를 전송했습니다.' });
    event.currentTarget.reset();
    setTargetUserId('');
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>내 공지함</CardTitle>
            <CardDescription>관리자가 보낸 개인 공지입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {receivedForMe.length === 0 && <p className="text-sm text-muted-foreground">받은 공지가 없습니다.</p>}
            {receivedForMe.map((notice) => (
              <div key={notice.id} className="rounded-lg border p-3">
                <p className="font-semibold">{notice.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{notice.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  보낸이: {notice.senderName} · {new Date(notice.createdAt).toLocaleString('ko-KR')}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>개별 공지 보내기</CardTitle>
            <CardDescription>
              {isAdmin ? '성도 1명에게 공지를 보낼 수 있습니다.' : '시무장로/담임목사만 발송할 수 있습니다.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="target-user">수신자</Label>
                <Select value={targetUserId} onValueChange={setTargetUserId} disabled={!isAdmin}>
                  <SelectTrigger id="target-user">
                    <SelectValue placeholder="교인을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {members
                      .filter((item) => item.uid !== user?.uid)
                      .map((item) => (
                        <SelectItem key={item.uid} value={item.uid}>
                          {item.koreanName} ({item.position})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input id="title" name="title" placeholder="공지 제목" disabled={!isAdmin} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">내용</Label>
                <Textarea id="content" name="content" placeholder="공지 내용을 입력하세요" disabled={!isAdmin} required />
              </div>

              <Button type="submit" className="w-full" disabled={!isAdmin || !targetUserId}>
                <Send className="mr-2 h-4 w-4" />
                공지 보내기
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
