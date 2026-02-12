'use client';

import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { SermonCard } from '@/components/app/sermon-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sermons } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

// Mock current user role
const currentUserRole = '시무장로';
const canAddSermon = currentUserRole === '시무장로' || currentUserRole === '담임목사';

export default function SermonsPage() {
  const [playingSermon, setPlayingSermon] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePlaySermon = (url: string) => {
    setPlayingSermon(url);
  };

  const handleAddSermon = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const youtubeUrl = formData.get('youtubeUrl') as string;
    if (youtubeUrl) {
      console.log('Adding new sermon:', youtubeUrl);
      toast({
        title: "설교 추가됨",
        description: "새로운 설교 영상이 목록에 추가되었습니다.",
      });
      // In a real app, you would close the dialog here after successful submission
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-headline">주일 설교</h1>
        {canAddSermon && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                설교 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>새 설교 추가</DialogTitle>
                <DialogDescription>
                  추가할 설교의 YouTube 링크를 입력하세요.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSermon} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="youtubeUrl" className="text-right">
                    YouTube 링크
                  </Label>
                  <Input
                    id="youtubeUrl"
                    name="youtubeUrl"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="col-span-3"
                  />
                </div>
                <Button type="submit">추가하기</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sermons.map((sermon) => (
          <SermonCard key={sermon.id} sermon={sermon} onPlay={handlePlaySermon} />
        ))}
      </div>

      {playingSermon && (
        <Dialog open={!!playingSermon} onOpenChange={(open) => !open && setPlayingSermon(null)}>
          <DialogContent className="max-w-4xl w-full p-0 border-0">
             <div className="aspect-video">
                <iframe
                    src={playingSermon}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                ></iframe>
             </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
