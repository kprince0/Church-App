'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Download, FileText, PlusCircle, UploadCloud } from 'lucide-react';
import { addDoc, collection, onSnapshot, query } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db, storage } from '@/lib/firebase/client';
import type { Bulletin } from '@/lib/firebase/schema';
import { useAuthMember } from '@/hooks/use-auth-member';
import { useToast } from '@/hooks/use-toast';

export default function BulletinPage() {
  const { user, isAdmin } = useAuthMember();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);

  useEffect(() => {
    if (!db) {
      return;
    }
    const q = query(collection(db, 'bulletins'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<Bulletin, 'id'>) }));
      docs.sort((a, b) => (a.date < b.date ? 1 : -1));
      setBulletins(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db || !storage || !user || !isAdmin) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const date = String(formData.get('date') || '');
    const title = String(formData.get('title') || `${date} 주보`);
    const file = formData.get('bulletin-file') as File;

    if (!file) {
      return;
    }

    setIsUploading(true);
    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      const filePath = `bulletins/${date}-${Date.now()}-${file.name}`;
      const uploadRef = ref(storage, filePath);
      await uploadBytes(uploadRef, file);
      const fileUrl = await getDownloadURL(uploadRef);

      await addDoc(collection(db, 'bulletins'), {
        title,
        date,
        fileUrl,
        fileType: extension,
        createdBy: user.uid,
      });

      toast({ title: '주보 업로드 완료', description: '주보가 날짜별 목록에 반영되었습니다.' });
      event.currentTarget.reset();
    } catch {
      toast({ title: '업로드 실패', description: '파일 업로드 중 오류가 발생했습니다.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline text-2xl font-bold">주보</h1>

        {isAdmin ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                주보 업로드
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 주보 업로드</DialogTitle>
                <DialogDescription>날짜를 지정하고 PDF/JPG/PNG 파일을 등록하세요.</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleUpload} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">제목</Label>
                  <Input id="title" name="title" placeholder="예: 2월 둘째 주 주보" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">주보 날짜</Label>
                  <Input id="date" name="date" type="date" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulletin-file">파일</Label>
                  <div className="rounded-md border-2 border-dashed p-6 text-center">
                    <UploadCloud className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">PDF, JPG, PNG (최대 10MB)</p>
                    <Input id="bulletin-file" name="bulletin-file" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isUploading}>
                  {isUploading ? '업로드 중...' : '업로드'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <p className="text-sm text-muted-foreground">주보 업로드는 시무장로/담임목사 권한이 필요합니다.</p>
        )}
      </div>

      <div className="space-y-4">
        {bulletins.map((bulletin) => (
          <Card key={bulletin.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">{bulletin.title}</p>
                  <p className="text-sm text-muted-foreground">
                    <CalendarDays className="mr-1 inline-block h-4 w-4" />
                    {bulletin.date} · {String(bulletin.fileType).toUpperCase()}
                  </p>
                </div>
              </div>

              <Button variant="outline" size="icon" asChild>
                <a href={bulletin.fileUrl} download={`${bulletin.date}_주보.${bulletin.fileType}`}>
                  <Download className="h-4 w-4" />
                  <span className="sr-only">다운로드</span>
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
