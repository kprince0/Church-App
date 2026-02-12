"use client";

import { useRouter, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users, chats as allChats } from '@/lib/data';
import type { Chat } from '@/lib/data';
import { Badge } from '../ui/badge';

// Mock current user role
const currentUserRole = '일반성도';

function getVisibleChats(): Chat[] {
  if (currentUserRole === '담임목사' || currentUserRole === '시무장로') {
    return allChats;
  }
  return allChats.filter(chat => !chat.isDepartment || chat.members.includes('user-current'));
}


export function ChatList() {
  const router = useRouter();
  const params = useParams();
  const visibleChats = getVisibleChats();

  const getChatDetails = (chat: Chat) => {
    const lastMessage = chat.messages[chat.messages.length - 1];
    if (chat.type === 'individual') {
      const otherUserId = chat.members.find(id => id !== 'user-current');
      const otherUser = users.find(u => u.id === otherUserId);
      return {
        name: otherUser?.koreanName || 'Unknown User',
        avatar: otherUser?.avatar.replace('.png', ''),
        lastMessage: lastMessage?.text,
        timestamp: lastMessage?.timestamp,
      };
    }
    return {
      name: chat.name,
      avatar: chat.avatar?.replace('.png', ''),
      lastMessage: lastMessage ? `${users.find(u=>u.id === lastMessage.senderId)?.koreanName}: ${lastMessage.text}` : 'No messages yet',
      timestamp: lastMessage?.timestamp,
    };
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-2">
        {visibleChats.map((chat) => {
          const details = getChatDetails(chat);
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
                <AvatarImage src={`https://picsum.photos/seed/${details.avatar}/100/100`} alt={details.name} />
                <AvatarFallback>{details.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="font-semibold truncate">{details.name}</p>
                  <span className="text-xs text-muted-foreground">{details.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{details.lastMessage}</p>
              </div>
              {chat.isDepartment && <Badge variant="secondary">기관</Badge>}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
