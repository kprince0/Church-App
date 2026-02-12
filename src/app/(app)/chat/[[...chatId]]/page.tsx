import { ChatList } from '@/components/app/chat-list';
import { ChatDisplay } from '@/components/app/chat-display';
import {ResizablePanelGroup, ResizablePanel, ResizableHandle} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';


export default function ChatPage({ params }: { params: { chatId?: string[] } }) {
  const chatId = params.chatId?.[0];
  
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className={cn(chatId && "hidden md:block")}>
                <div className="flex h-full flex-col">
                    <header className="flex h-16 items-center border-b bg-card px-4">
                        <h1 className="text-xl font-bold">채팅</h1>
                    </header>
                    <ChatList />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle className={cn(chatId && "hidden md:flex")} />
            <ResizablePanel defaultSize={70} className={cn(!chatId && "hidden md:block")}>
               {chatId ? <ChatDisplay chatId={chatId} /> : <div className="h-full hidden md:flex items-center justify-center bg-muted/30"><p className="text-muted-foreground">Select a chat to start messaging</p></div>}
            </ResizablePanel>
        </ResizablePanelGroup>
    </main>
  );
}
