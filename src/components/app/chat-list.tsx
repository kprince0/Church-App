"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase/client';
import type { ChatRoom } from '@/lib/firebase/schema';
import { useAuthMember } from '@/hooks/use-auth-member';

export function ChatList() {
  const router = useRouter();
  const params = useParams();
  const { user, isAdmin } = useAuthMember();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    if (!db || !user) {
      setRooms([]);
      return;
    }

    const base = collection(db, 'chats');
    const roomQuery = isAdmin
      ? query(base, orderBy('updatedAt', 'desc'))
      : query(base, where('members', 'array-contains', user.uid));

    const unsubscribe = onSnapshot(roomQuery, (snapshot) => {
      const nextRooms = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<ChatRoom, 'id'>) }));
      nextRooms.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
      setRooms(nextRooms);
    });

    return () => unsubscribe();
  }, [isAdmin, user]);

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-2">
        {rooms.map((chat) => {
          const isActive = params.chatId?.[0] === chat.id;

          return (
            <button
              key={chat.id}
              onClick={() => router.push(`/chat/${chat.id}`)}
              className={cn(
                'flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50',
                isActive ? 'bg-muted' : 'bg-transparent'
              )}
            >
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={`https://picsum.photos/seed/${chat.name}/100/100`} alt={chat.name} />
                <AvatarFallback>{chat.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{chat.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {chat.type === 'individual' ? '개인 채팅' : chat.department || '그룹 채팅'}
                </p>
              </div>
              {chat.isDepartment && <Badge variant="secondary">기관</Badge>}
            </button>
          );
        })}
        {rooms.length === 0 && <p className="p-3 text-sm text-muted-foreground">표시할 채팅방이 없습니다.</p>}
      </div>
    </ScrollArea>
  );
}
