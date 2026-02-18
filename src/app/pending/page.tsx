"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { logout } from '@/lib/firebase/auth';

export default function PendingPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>승인 대기 중</CardTitle>
          <CardDescription>교인 등록이 완료되었습니다. 관리자 승인 후 앱의 모든 기능을 사용할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogout} variant="outline">로그아웃</Button>
        </CardContent>
      </Card>
    </main>
  );
}
