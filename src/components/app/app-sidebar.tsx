"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Landmark,
  LogOut,
  MessageSquare,
  Megaphone,
  Newspaper,
  User,
  Video,
  Church,
  Shield,
} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { churchName } from '@/lib/data';
import { logout } from '@/lib/firebase/auth';
import { useAuthMember } from '@/hooks/use-auth-member';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { member, isAdmin } = useAuthMember();

  const menuItems = [
    { href: '/about', label: '교회 소개', icon: Church },
    { href: '/chat', label: '채팅', icon: MessageSquare },
    { href: '/announcement', label: '개별 공지', icon: Megaphone },
    { href: '/sermons', label: '설교', icon: Video },
    { href: '/bulletin', label: '주보', icon: Newspaper },
    { href: '/explore', label: '성경/찬송', icon: BookOpen },
    { href: '/tithing', label: '헌금 내역', icon: Landmark },
    ...(isAdmin ? [{ href: '/admin', label: '관리자', icon: Shield }] : []),
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://picsum.photos/seed/jkpc/100/100" alt={churchName} />
            <AvatarFallback>JK</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">{churchName}</span>
            <span className="text-xs text-sidebar-foreground/70">통합 교회 앱</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                onClick={() => router.push(item.href)}
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label }}
              >
                <a>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push('/profile')} tooltip={{ children: '내 정보' }} variant="outline">
              <User />
              <span>{member?.koreanName || '내 정보'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={{ children: '로그아웃' }}
              variant="outline"
              className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut />
              <span>로그아웃</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
