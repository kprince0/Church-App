"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { File as FileIcon, MessageSquare, Paperclip, SendHorizonal } from 'lucide-react';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { db, storage } from '@/lib/firebase/client';
import type { ChatMessage, ChatRoom } from '@/lib/firebase/schema';
import { useAuthMember } from '@/hooks/use-auth-member';
import { useToast } from '@/hooks/use-toast';

export function ChatDisplay({ chatId }: { chatId: string }) {
  const { user, member } = useAuthMember();
  const { toast } = useToast();
  const [chat, setChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!db) {
      return;
    }
    const roomRef = doc(db, 'chats', chatId);
    const stopRoom = onSnapshot(roomRef, (snapshot) => {
      if (!snapshot.exists()) {
        setChat(null);
        return;
      }
      setChat({ id: snapshot.id, ...(snapshot.data() as Omit<ChatRoom, 'id'>) });
    });

    const messageQuery = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));
    const stopMessages = onSnapshot(messageQuery, (snapshot) => {
      const next = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<ChatMessage, 'id'>),
      }));
      setMessages(next);
    });

    return () => {
      stopRoom();
      stopMessages();
    };
  }, [chatId]);

  const pushMessage = async (payload: Partial<ChatMessage>) => {
    if (!db || !user || !member) {
      return;
    }

    const messageRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messageRef, {
      senderId: user.uid,
      senderName: member.koreanName,
      ...payload,
      createdAt: new Date().toISOString(),
      createdAtServer: serverTimestamp(),
    });

    await updateDoc(doc(db, 'chats', chatId), {
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) {
      return;
    }
    await pushMessage({ text: text.trim() });
    setText('');
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!storage || !file || !user) {
      return;
    }

    setUploading(true);
    try {
      if (file.type.startsWith('image/')) {
        const filePath = `chat-images/${chatId}/${Date.now()}-${file.name}`;
        const uploadRef = ref(storage, filePath);
        await uploadBytes(uploadRef, file);
        const url = await getDownloadURL(uploadRef);
        await pushMessage({ imageUrl: url, imageThumbUrl: url, text: '' });
      } else {
        const filePath = `chat-files/${chatId}/${Date.now()}-${file.name}`;
        const uploadRef = ref(storage, filePath);
        await uploadBytes(uploadRef, file);
        const url = await getDownloadURL(uploadRef);
        await pushMessage({ fileUrl: url, fileName: file.name });
      }
    } catch {
      toast({
        title: '업로드 실패',
        description: '파일 전송 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  if (!chat) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-muted/20">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">채팅을 선택하세요</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 items-center border-b bg-card px-4">
        <h2 className="text-lg font-semibold">{chat.name}</h2>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((message) => {
            const mine = message.senderId === user?.uid;
            return (
              <div key={message.id} className={cn('flex items-end gap-2', mine ? 'justify-end' : 'justify-start')}>
                {!mine && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{message.senderName?.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                )}
                <div className="max-w-[75%]">
                  {!mine && <p className="mb-1 ml-1 text-xs text-muted-foreground">{message.senderName}</p>}
                  <div className={cn('rounded-lg p-3', mine ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                    {message.imageUrl ? (
                      <Image src={message.imageThumbUrl || message.imageUrl} alt="이미지" width={280} height={180} className="rounded-md border object-cover" />
                    ) : null}
                    {message.fileUrl ? (
                      <Card className="border-none shadow-none">
                        <CardContent className="flex items-center gap-3 p-0">
                          <FileIcon className="h-8 w-8 text-muted-foreground" />
                          <a href={message.fileUrl} target="_blank" rel="noreferrer" className="underline">
                            {message.fileName || '파일 열기'}
                          </a>
                        </CardContent>
                      </Card>
                    ) : null}
                    {message.text && <p>{message.text}</p>}
                  </div>
                  <p className={cn('mt-1 text-xs text-muted-foreground', mine ? 'text-right' : 'text-left')}>
                    {new Date(message.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <footer className="border-t bg-card p-4">
        <form className="flex items-center gap-2" onSubmit={handleSend}>
          <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} />
          <Button type="button" variant="ghost" size="icon" title="파일/사진 전송" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input value={text} onChange={(event) => setText(event.target.value)} placeholder="메시지를 입력하세요..." className="flex-1" />
          <Button type="submit" size="icon" disabled={uploading}>
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
