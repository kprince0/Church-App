import Image from 'next/image';
import { PlayCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { getYoutubeThumbnail } from '@/lib/data';
import type { Sermon } from '@/lib/firebase/schema';

export function SermonCard({ sermon, onPlay }: { sermon: Sermon; onPlay: (url: string) => void }) {
  return (
    <Card className="group cursor-pointer overflow-hidden" onClick={() => onPlay(sermon.youtubeUrl)}>
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image src={getYoutubeThumbnail(sermon.youtubeUrl)} alt={sermon.title} fill className="object-cover transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <PlayCircle className="h-16 w-16 text-white/90 transition-transform group-hover:scale-110" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="truncate text-lg font-semibold">{sermon.title}</h3>
        <p className="text-sm text-muted-foreground">{sermon.preacher}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="text-xs text-muted-foreground">{sermon.date}</p>
      </CardFooter>
    </Card>
  );
}
