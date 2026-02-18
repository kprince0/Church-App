"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AppSidebar } from '@/components/app/app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { churchName } from '@/lib/data';
import { useAuthMember } from '@/hooks/use-auth-member';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, member, loading } = useAuthMember();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      router.replace('/login');
      return;
    }
    if (member && member.status !== 'approved') {
      router.replace('/pending');
    }
  }, [loading, member, router, user]);

  if (loading || !user || !member || member.status !== 'approved') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">접속 확인 중...</p>
      </main>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
          <h1 className="text-sm font-semibold">{churchName}</h1>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
