export const dynamic = "force-static"
import { ChatDisplay } from '@/components/app/chat-display';
import { ChatList } from '@/components/app/chat-list';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';

export default async function ChatPage({ params }: { params: Promise<{ chatId?: string[] }> }) {
  const { chatId: chatIds } = await params;
  const chatId = chatIds?.[0];

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className={cn(chatId && 'hidden md:block')}>
          <div className="flex h-full flex-col">
            <header className="flex h-16 items-center border-b bg-card px-4">
              <h1 className="text-xl font-bold">채팅</h1>
            </header>
            <ChatList />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className={cn(chatId && 'hidden md:flex')} />

        <ResizablePanel defaultSize={70} className={cn(!chatId && 'hidden md:block')}>
          {chatId ? (
            <ChatDisplay chatId={chatId} />
          ) : (
            <div className="hidden h-full items-center justify-center bg-muted/30 md:flex">
              <p className="text-muted-foreground">대화를 선택하면 채팅이 열립니다.</p>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
