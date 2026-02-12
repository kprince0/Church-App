"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, LogOut, MessageSquare, Newspaper, User, Video, Landmark } from 'lucide-react';

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
import { users } from '@/lib/data';

const currentUser = users.find(u => u.id === 'user-current');

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { href: '/chat', label: '채팅', icon: MessageSquare },
    { href: '/sermons', label: '설교', icon: Video },
    { href: '/bulletin', label: '주보', icon: Newspaper },
    { href: '/explore', label: '성경과 찬송', icon: BookOpen },
    { href: '/tithing', label: '헌금내역', icon: Landmark },
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://picsum.photos/seed/ekklesia_logo/100/100" alt="EkklesiaConnect" />
            <AvatarFallback>EC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-sidebar-foreground">EkklesiaConnect</span>
            <span className="text-xs text-sidebar-foreground/70">교회 커뮤니티 앱</span>
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
              <SidebarMenuButton
                onClick={() => router.push('/profile')}
                tooltip={{ children: '프로필' }}
                variant="ghost"
              >
                <User />
                <span>프로필</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip={{ children: '로그아웃' }}
                variant="ghost"
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
