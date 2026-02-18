'use client';

import { useMemo, useState } from 'react';
import { BookOpen, Music2, Search } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bibleVerses, hymns } from '@/lib/data';

export default function ExplorePage() {
  const [query, setQuery] = useState('');

  const filteredVerses = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return bibleVerses;
    }
    return bibleVerses.filter((verse) => {
      return (
        verse.book.toLowerCase().includes(keyword) ||
        verse.korean.toLowerCase().includes(keyword) ||
        verse.english.toLowerCase().includes(keyword)
      );
    });
  }, [query]);

  const filteredHymns = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return hymns;
    }
    return hymns.filter((hymn) => {
      return (
        hymn.title.toLowerCase().includes(keyword) ||
        hymn.koreanLyrics.toLowerCase().includes(keyword) ||
        hymn.englishLyrics.toLowerCase().includes(keyword) ||
        String(hymn.number).includes(keyword)
      );
    });
  }, [query]);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">성경/찬송 검색</CardTitle>
            <CardDescription>
              한글/영문 키워드로 성경 구절과 새찬송가를 찾을 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="예: 사랑, 요한복음 3:16, 288"
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="bible" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bible">한영 개정개역 성경</TabsTrigger>
            <TabsTrigger value="hymn">한영 새찬송가</TabsTrigger>
          </TabsList>

          <TabsContent value="bible" className="space-y-3">
            {filteredVerses.map((verse) => (
              <Card key={verse.id}>
                <CardContent className="space-y-2 p-4">
                  <p className="flex items-center gap-2 font-semibold">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {verse.book} {verse.chapter}:{verse.verse}
                  </p>
                  <p>{verse.korean}</p>
                  <p className="text-sm text-muted-foreground">{verse.english}</p>
                </CardContent>
              </Card>
            ))}
            {filteredVerses.length === 0 && <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>}
          </TabsContent>

          <TabsContent value="hymn" className="space-y-3">
            {filteredHymns.map((hymn) => (
              <Card key={hymn.id}>
                <CardContent className="space-y-2 p-4">
                  <p className="flex items-center gap-2 font-semibold">
                    <Music2 className="h-4 w-4 text-primary" />
                    {hymn.number}장 {hymn.title}
                  </p>
                  <p className="text-sm">{hymn.koreanLyrics}</p>
                  <p className="text-sm text-muted-foreground">{hymn.englishLyrics}</p>
                  <a href={hymn.sheetMusicUrl} className="text-sm text-primary underline" target="_blank" rel="noreferrer">
                    악보 보기
                  </a>
                </CardContent>
              </Card>
            ))}
            {filteredHymns.length === 0 && <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
