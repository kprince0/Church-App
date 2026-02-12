"use client";

import Image from 'next/image';
import { Paperclip, SendHorizonal, Smile, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { chats, users } from '@/lib/data';
import type { Chat } from '@/lib/data';
import { Card, CardContent } from '../ui/card';


export function ChatDisplay({ chatId }: { chatId: string }) {
  const chat = chats.find((c) => c.id === chatId) as Chat;
  const currentUser = users.find(u => u.id === 'user-current');
  
  const getChatName = () => {
    if (chat.type === 'group') return chat.name;
    const otherUserId = chat.members.find(id => id !== currentUser?.id);
    return users.find(u => u.id === otherUserId)?.koreanName || 'Chat';
  }

  if (!chat) {
    return (
        <div className="flex h-full flex-col items-center justify-center bg-muted/20">
            <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">채팅을 선택하세요</h3>
                <p className="mt-1 text-sm text-muted-foreground">목록에서 대화를 선택하여 시작하세요.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 items-center border-b bg-card px-4">
        <h2 className="text-lg font-semibold">{getChatName()}</h2>
      </header>
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {chat.messages.map((message, index) => {
            const sender = users.find((u) => u.id === message.senderId);
            const isCurrentUser = message.senderId === currentUser?.id;

            return (
              <div
                key={index}
                className={cn(
                  'flex items-end gap-2',
                  isCurrentUser ? 'justify-end' : 'justify-start'
                )}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://picsum.photos/seed/${sender?.avatar.replace('.png', '')}/100/100`} alt={sender?.koreanName} />
                    <AvatarFallback>{sender?.koreanName.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col" style={{ maxWidth: '75%' }}>
                    {!isCurrentUser && <span className="text-xs text-muted-foreground mb-1 ml-1">{sender?.koreanName}</span>}
                    <div
                    className={cn(
                        'rounded-lg p-3',
                        isCurrentUser
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted rounded-bl-none'
                    )}
                    >
                    {message.image ? (
                        <Image
                            src={message.image}
                            alt="Shared image"
                            width={300}
                            height={200}
                            className="rounded-md"
                            data-ai-hint="community gathering"
                        />
                    ) : message.file ? (
                        <Card>
                            <CardContent className="p-3 flex items-center gap-3">
                                <FileIcon className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">{message.file.name}</p>
                                    <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => window.open(message.file?.url, '_blank')}>Download</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <p>{message.text}</p>
                    )}
                    </div>
                    <span className={cn("text-xs text-muted-foreground mt-1", isCurrentUser ? "text-right" : "text-left")}>{message.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <footer className="border-t bg-card p-4">
        <form className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input placeholder="메시지를 입력하세요..." className="flex-1" />
          <Button type="button" variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Button type="submit" size="icon">
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
