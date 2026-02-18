'use client';

import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { addDoc, collection, onSnapshot, query } from 'firebase/firestore';

import { SermonCard } from '@/components/app/sermon-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/firebase/client';
import { getYoutubeEmbedUrl } from '@/lib/data';
import type { Sermon } from '@/lib/firebase/schema';
import { useToast } from '@/hooks/use-toast';
import { useAuthMember } from '@/hooks/use-auth-member';

export default function SermonsPage() {
  const { user, member, isAdmin } = useAuthMember();
  const [playingSermon, setPlayingSermon] = useState<string | null>(null);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!db) {
      return;
    }
    const q = query(collection(db, 'sermons'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<Sermon, 'id'>) }));
      docs.sort((a, b) => (a.date < b.date ? 1 : -1));
      setSermons(docs);
    });
    return () => unsubscribe();
  }, []);

  const handlePlaySermon = (url: string) => {
    const embedUrl = getYoutubeEmbedUrl(url);
    if (embedUrl) {
      setPlayingSermon(embedUrl);
    }
  };

  const handleAddSermon = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db || !user || !member || !isAdmin) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    await addDoc(collection(db, 'sermons'), {
      title: String(formData.get('title') || ''),
      preacher: String(formData.get('preacher') || member.koreanName),
      youtubeUrl: String(formData.get('youtubeUrl') || ''),
      date: String(formData.get('date') || new Date().toISOString().slice(0, 10)),
      createdBy: user.uid,
    });

    toast({
      title: '설교 링크 등록',
      description: '새 설교 영상 링크가 추가되었습니다.',
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline text-2xl font-bold">설교 영상</h1>

        {isAdmin ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                설교 링크 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[460px]">
              <DialogHeader>
                <DialogTitle>새 설교 링크 등록</DialogTitle>
                <DialogDescription>시무장로/담임목사 권한으로 YouTube 링크를 등록합니다.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSermon} className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">설교 제목</Label>
                  <Input id="title" name="title" placeholder="설교 제목" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preacher">설교자</Label>
                  <Input id="preacher" name="preacher" placeholder="설교자" defaultValue={member?.koreanName || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">설교 날짜</Label>
                  <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">YouTube 링크</Label>
                  <Input id="youtubeUrl" name="youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." required />
                </div>
                <Button type="submit">등록</Button>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <p className="text-sm text-muted-foreground">설교 링크 등록은 시무장로만 가능합니다.</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sermons.map((sermon) => (
          <SermonCard key={sermon.id} sermon={sermon} onPlay={handlePlaySermon} />
        ))}
      </div>

      {playingSermon && (
        <Dialog open={!!playingSermon} onOpenChange={(open) => !open && setPlayingSermon(null)}>
          <DialogContent className="w-full max-w-5xl border-0 p-0">
            <div className="aspect-video">
              <iframe
                src={playingSermon}
                title="설교 영상"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
