import Image from 'next/image';
import { Sermon } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SermonCard({ sermon, onPlay }: { sermon: Sermon, onPlay: (url: string) => void }) {
  return (
    <Card className="overflow-hidden group cursor-pointer" onClick={() => onPlay(sermon.youtubeUrl)}>
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={sermon.thumbnailUrl}
            alt={sermon.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            data-ai-hint="church cross"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <PlayCircle className="h-16 w-16 text-white/80 transition-transform group-hover:scale-110" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{sermon.title}</h3>
        <p className="text-sm text-muted-foreground">{sermon.preacher}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="text-xs text-muted-foreground">{sermon.date}</p>
      </CardFooter>
    </Card>
  );
}
